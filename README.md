# 📊 Laboratoire de Sérialisation : JSON vs XML vs Protobuf

## 🎯 Objectif du TP

Comparer trois formats de sérialisation de données (JSON, XML et Protobuf) pour comprendre leurs différences en termes de :
- **Taille des fichiers** générés
- **Performance** d'encodage et de décodage
- **Simplicité d'utilisation**

Ce laboratoire démontre pourquoi **gRPC utilise Protocol Buffers (Protobuf) par défaut** pour les communications entre services.

## 📚 Objectifs pédagogiques

À la fin de ce TP, vous serez capable de :
- Sérialiser des données JavaScript en trois formats différents
- Mesurer et comparer la taille des fichiers générés
- Évaluer les temps d'encodage et de décodage pour chaque format
- Expliquer les avantages de Protobuf pour les systèmes distribués

## 🛠️ Prérequis techniques

- **Node.js** (version 14 ou supérieure)
- **npm** (gestionnaire de paquets Node.js)
- Connaissances de base en JavaScript

## 📦 Dépendances nécessaires

Deux bibliothèques Node.js sont utilisées :
- **xml-js** : pour la conversion entre JSON et XML
- **protobufjs** : pour travailler avec Protocol Buffers

## 📁 Structure du projet

```
serialization-lab/
├── employee.proto     # Définition du schéma Protobuf
├── index.js          # Script principal du laboratoire
├── data.json         # Fichier JSON généré
├── data.xml          # Fichier XML généré
└── data.proto        # Fichier Protobuf binaire généré
```

## 🔧 Étapes du laboratoire

### 1. Installation des dépendances
Installation des bibliothèques nécessaires via npm.

### 2. Création des données de test
Création d'une liste d'employés en mémoire avec des propriétés simples (id, nom, salaire).

### 3. Sérialisation en JSON
Conversion de l'objet JavaScript en format JSON compact.

### 4. Sérialisation en XML
Transformation des mêmes données en format XML avec options de compression.

### 5. Sérialisation en Protobuf
- Définition d'un schéma dans un fichier `.proto`
- Validation des données par rapport au schéma
- Encodage en format binaire compact

### 6. Écriture des fichiers
Sauvegarde des trois formats dans des fichiers séparés.

### 7. Mesure des performances
Comparaison des :
- Tailles des fichiers générés
- Temps d'encodage pour chaque format
- Temps de décodage pour chaque format

## 📊 Résultats attendus

### Taille des fichiers (pour 3 employés)
- **JSON** : ~127 octets
- **XML** : ~224 octets (76% plus gros que JSON)
- **Protobuf** : ~41 octets (68% plus petit que JSON)

### Performances d'encodage/décodage
- **JSON** : Très rapide (natif en JavaScript)
- **XML** : Plus lent (parsing plus complexe)
- **Protobuf** : Le plus rapide (format binaire optimisé)

## 🔍 Analyse des résultats

### Pourquoi Protobuf est plus efficace ?

1. **Format binaire** : Pas de texte, donc plus compact
2. **Tags numériques** : Utilise 1, 2, 3 au lieu de "id", "name", "salary"
3. **Encodage varint** : Les petits nombres prennent moins d'octets
4. **Pas de métadonnées** : Pas de noms de champs répétés
5. **Validation intégrée** : Vérification du schéma pendant l'encodage

### Impact sur les communications réseau

Avec Protobuf :
- **Moins de bande passante** utilisée
- **Transferts plus rapides** (taille réduite)
- **Meilleure latence** (encodage/décodage rapides)
- **Validation des données** (moins d'erreurs)

## 🏁 Conclusion

### Choisir le bon format selon le besoin

| Format | Meilleur pour | Moins adapté pour |
|--------|---------------|-------------------|
| **JSON** | APIs REST, interfaces web, simplicité | Communications à haute fréquence |
| **XML** | Systèmes legacy, documents structurés | Performances réseau critiques |
| **Protobuf** | Microservices, gRPC, haute performance | Débogage humain (format binaire) |

### Pourquoi gRPC utilise Protobuf ?

1. **Performance** : Encodage/décodage ultra-rapide
2. **Compression** : Taille minimale pour le réseau
3. **Typage fort** : Validation au niveau du schéma
4. **Multi-langage** : Support de nombreux langages
5. **Évolutivité** : Compatibilité ascendante/descendante

## 📈 Enseignements clés

- **Protobuf** est le choix optimal pour les **systèmes distribués** et **gRPC**
- **JSON** reste idéal pour les **APIs web** et la **simplicité**
- **XML** est adapté aux **documents complexes** et systèmes existants
- Le choix du format dépend toujours du **contexte d'utilisation**

Ce laboratoire illustre clairement les compromis entre lisibilité humaine, performance machine et efficacité réseau dans le choix d'un format de sérialisation.

## Démonstration



https://github.com/user-attachments/assets/984c77eb-36be-42f9-8301-370d00bf9660




## Auteurs 

Réalisé par : ettouyjer yasmine.

Encadré par : Pr.Mohamed Lechgar.

Date : le 12-01-2026.
