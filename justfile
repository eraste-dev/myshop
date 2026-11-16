# Commandes du projet. Lancer `just` seul pour voir la liste.
# Les scripts sont dans infra/scripts (bash : Git Bash sous Windows).

set shell := ["bash", "-cu"]
# Sous Windows, `bash` désigne souvent celui de WSL (sans distribution installée) : on vise explicitement Git Bash.
# Chemin par défaut de Git for Windows ; à adapter si Git est installé ailleurs.
set windows-shell := ["C:/Program Files/Git/bin/bash.exe", "-cu"]

# Les arguments sont passés en paramètres positionnels ($1, $@), jamais insérés dans la ligne de commande :
# cela évite toute injection de commande (ex. `just build "client; rm -rf x"`).
set positional-arguments

scripts := "infra/scripts"

# Affiche la liste des commandes
default:
    @just --list --unsorted

# Installe les dépendances de tout le monorepo
install:
    bash {{ scripts }}/install.sh

# Lance une application en développement : client, client-admin, client-platform, ou all
dev app="client":
    bash {{ scripts }}/dev.sh "$1"

# Lance la vitrine (http://localhost:3000)
client:
    bash {{ scripts }}/dev.sh client

# Lance le back-office d'une boutique (http://localhost:3001), pas encore créé
client-admin:
    bash {{ scripts }}/dev.sh client-admin

# Lance l'app générale de gestion des boutiques (http://localhost:3002), pas encore créée
client-platform:
    bash {{ scripts }}/dev.sh client-platform

# Lance le backend (http://localhost:4000), langage non choisi
backend:
    bash {{ scripts }}/dev.sh backend

# Construit une application pour la production
build app="client":
    bash {{ scripts }}/build.sh "$1"

# Lance la version de production (construit d'abord si nécessaire)
preview app="client":
    bash {{ scripts }}/preview.sh "$1"

# Tests de tous les paquets
test:
    bash {{ scripts }}/check.sh test

# Contrôle de types de tous les paquets
typecheck:
    bash {{ scripts }}/check.sh typecheck

# Tests et contrôle de types
check:
    bash {{ scripts }}/check.sh all

# Supprime les fichiers générés (ajouter --deps pour retirer aussi node_modules)
clean *args:
    bash {{ scripts }}/clean.sh "$@"
