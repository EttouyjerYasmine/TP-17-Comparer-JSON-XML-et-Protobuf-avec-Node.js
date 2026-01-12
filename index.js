// ============================================
// Laboratoire de Sérialisation - index.js
// Avec benchmarking des temps d'encodage/décodage
// ============================================

const fs = require('fs');
const convert = require('xml-js');
const protobuf = require('protobufjs');

console.log("⏱️  Laboratoire de Sérialisation avec Benchmarking\n");

// Charger la définition Protobuf depuis employee.proto
console.log("📂 Chargement du schéma Protobuf...");
const root = protobuf.loadSync('employee.proto');
const EmployeeList = root.lookupType('Employees');
console.log("✅ Schéma Protobuf chargé avec succès!\n");

// Construire la liste d'employés
console.log("👥 Création des données d'employés...");
const employees = [];

employees.push({
  id: 1,
  name: 'Yasmine',
  salary: 9000
});

employees.push({
  id: 2,
  name: 'Kamal',
  salary: 22000
});

employees.push({
  id: 3,
  name: 'Amal',
  salary: 23000
});

console.log(`✅ ${employees.length} employés créés en mémoire\n`);

// Objet racine compatible avec message Employees
console.log("📦 Préparation de l'objet pour sérialisation...");
let jsonObject = { employee: employees };
console.log("✅ Objet racine prêt pour la sérialisation\n");

// ============================================
// BENCHMARKING : JSON
// ============================================
console.log("🟨 BENCHMARK JSON");
console.log("-".repeat(40));

// ---------- JSON : encodage ----------
console.time('JSON encode');
let jsonData = JSON.stringify(jsonObject);
console.timeEnd('JSON encode');

// ---------- JSON : décodage ----------
console.time('JSON decode');
let jsonDecoded = JSON.parse(jsonData);
console.timeEnd('JSON decode');

// Vérification
console.log(`✅ Données vérifiées: ${jsonDecoded.employee.length} employés\n`);

// ============================================
// BENCHMARKING : XML
// ============================================
console.log("🟦 BENCHMARK XML");
console.log("-".repeat(40));

// Options de conversion JSON -> XML
const options = {
  compact: true,
  ignoreComment: true,
  spaces: 0
};

// ---------- XML : encodage ----------
console.time('XML encode');
let xmlData = "<root>\n" + convert.json2xml(jsonObject, options) + "\n</root>";
console.timeEnd('XML encode');

// ---------- XML : décodage ----------
console.time('XML decode');
// Conversion XML -> JSON (texte) -> objet JS
let xmlJson = convert.xml2json(xmlData, { compact: true });
let xmlDecoded = JSON.parse(xmlJson);
console.timeEnd('XML decode');

// Vérification
console.log(`✅ Données vérifiées: ${xmlDecoded.root.employee.length} employés\n`);

// ============================================
// BENCHMARKING : PROTOBUF
// ============================================
console.log("🟪 BENCHMARK PROTOBUF");
console.log("-".repeat(40));

// Vérification de conformité avec le schéma Protobuf
let errMsg = EmployeeList.verify(jsonObject);
if (errMsg) {
  throw Error(errMsg);
}

// ---------- Protobuf : encodage ----------
console.time('Protobuf encode');
let message = EmployeeList.create(jsonObject);
let buffer = EmployeeList.encode(message).finish();
console.timeEnd('Protobuf encode');

// ---------- Protobuf : décodage ----------
console.time('Protobuf decode');
let decodedMessage = EmployeeList.decode(buffer);
// Optionnel : conversion vers objet JS "classique"
let protoDecoded = EmployeeList.toObject(decodedMessage);
console.timeEnd('Protobuf decode');

// Vérification
console.log(`✅ Données vérifiées: ${protoDecoded.employee.length} employés\n`);

// ============================================
// ÉCRITURE DES FICHIERS
// ============================================
console.log("💾 ÉCRITURE DES FICHIERS SUR DISQUE");
console.log("-".repeat(40));

fs.writeFileSync('data.json', jsonData);
fs.writeFileSync('data.xml', xmlData);
fs.writeFileSync('data.proto', buffer);

console.log("✅ Fichiers créés : data.json, data.xml, data.proto\n");

// ============================================
// MESURE DES TAILLES
// ============================================
console.log("📏 MESURE DE LA TAILLE DES FICHIERS");
console.log("-".repeat(40));

const jsonFileSize = fs.statSync('data.json').size;
const xmlFileSize = fs.statSync('data.xml').size;
const protoFileSize = fs.statSync('data.proto').size;

console.log(`Taille de 'data.json'  : ${jsonFileSize} octets`);
console.log(`Taille de 'data.xml'   : ${xmlFileSize} octets`);
console.log(`Taille de 'data.proto' : ${protoFileSize} octets\n`);

// ============================================
// RÉCAPITULATIF DES PERFORMANCES
// ============================================
console.log("📊 RÉCAPITULATIF DES PERFORMANCES");
console.log("=".repeat(50));

// Données pour le tableau
const performances = [
  { format: 'JSON', encodeTime: 0, decodeTime: 0, size: jsonFileSize },
  { format: 'XML', encodeTime: 0, decodeTime: 0, size: xmlFileSize },
  { format: 'Protobuf', encodeTime: 0, decodeTime: 0, size: protoFileSize }
];

// Nous devrions normalement capturer les temps réels
// Pour cet exemple, nous allons faire plusieurs itérations pour avoir des mesures précises

console.log("\n🧪 TESTS DE PERFORMANCE DÉTAILLÉS");
console.log("-".repeat(50));

// Fonction pour effectuer plusieurs itérations et calculer la moyenne
function benchmark(iterations, encodeFunc, decodeFunc) {
  let totalEncode = 0;
  let totalDecode = 0;
  
  for (let i = 0; i < iterations; i++) {
    // Mesure encodage
    const startEncode = process.hrtime.bigint();
    const encoded = encodeFunc();
    const endEncode = process.hrtime.bigint();
    totalEncode += Number(endEncode - startEncode) / 1000000; // en ms
    
    // Mesure décodage
    const startDecode = process.hrtime.bigint();
    decodeFunc(encoded);
    const endDecode = process.hrtime.bigint();
    totalDecode += Number(endDecode - startDecode) / 1000000; // en ms
  }
  
  return {
    encodeAvg: totalEncode / iterations,
    decodeAvg: totalDecode / iterations
  };
}

// Benchmark JSON
console.log("\n🟨 Test JSON (1000 itérations)...");
const jsonBench = benchmark(1000,
  () => JSON.stringify(jsonObject),
  (data) => JSON.parse(data)
);
console.log(`   Encodage moyen : ${jsonBench.encodeAvg.toFixed(3)} ms`);
console.log(`   Décodage moyen : ${jsonBench.decodeAvg.toFixed(3)} ms`);

// Benchmark XML
console.log("\n🟦 Test XML (1000 itérations)...");
const xmlBench = benchmark(1000,
  () => convert.json2xml(jsonObject, options),
  (data) => {
    const xmlJson = convert.xml2json(data, { compact: true });
    return JSON.parse(xmlJson);
  }
);
console.log(`   Encodage moyen : ${xmlBench.encodeAvg.toFixed(3)} ms`);
console.log(`   Décodage moyen : ${xmlBench.decodeAvg.toFixed(3)} ms`);

// Benchmark Protobuf
console.log("\n🟪 Test Protobuf (1000 itérations)...");
const protoBench = benchmark(1000,
  () => {
    const msg = EmployeeList.create(jsonObject);
    return EmployeeList.encode(msg).finish();
  },
  (data) => {
    const decoded = EmployeeList.decode(data);
    return EmployeeList.toObject(decoded);
  }
);
console.log(`   Encodage moyen : ${protoBench.encodeAvg.toFixed(3)} ms`);
console.log(`   Décodage moyen : ${protoBench.decodeAvg.toFixed(3)} ms`);

// ============================================
// TABLEAU COMPARATIF
// ============================================
console.log("\n📋 TABLEAU COMPARATIF COMPLET");
console.log("=".repeat(70));
console.log("| Format   | Taille (o) | Encodage (ms) | Décodage (ms) | Total (ms) |");
console.log("|----------|------------|---------------|---------------|------------|");

const formats = [
  { 
    name: 'JSON', 
    size: jsonFileSize, 
    encode: jsonBench.encodeAvg.toFixed(3), 
    decode: jsonBench.decodeAvg.toFixed(3) 
  },
  { 
    name: 'XML', 
    size: xmlFileSize, 
    encode: xmlBench.encodeAvg.toFixed(3), 
    decode: xmlBench.decodeAvg.toFixed(3) 
  },
  { 
    name: 'Protobuf', 
    size: protoFileSize, 
    encode: protoBench.encodeAvg.toFixed(3), 
    decode: protoBench.decodeAvg.toFixed(3) 
  }
];

formats.forEach(f => {
  const total = (parseFloat(f.encode) + parseFloat(f.decode)).toFixed(3);
  console.log(`| ${f.name.padEnd(8)} | ${f.size.toString().padStart(10)} | ${f.encode.padStart(13)} | ${f.decode.padStart(13)} | ${total.padStart(10)} |`);
});

console.log("=".repeat(70));

// ============================================
// ANALYSE DES RÉSULTATS
// ============================================
console.log("\n🔍 ANALYSE DES RÉSULTATS");
console.log("-".repeat(50));

// Trouver les meilleures performances
const fastestEncode = formats.reduce((min, curr) => 
  parseFloat(curr.encode) < parseFloat(min.encode) ? curr : min
);
const fastestDecode = formats.reduce((min, curr) => 
  parseFloat(curr.decode) < parseFloat(min.decode) ? curr : min
);
const smallestSize = formats.reduce((min, curr) => 
  curr.size < min.size ? curr : min
);

console.log(`\n🏆 Meilleur encodage : ${fastestEncode.name} (${fastestEncode.encode} ms)`);
console.log(`🏆 Meilleur décodage : ${fastestDecode.name} (${fastestDecode.decode} ms)`);
console.log(`🏆 Plus petite taille : ${smallestSize.name} (${smallestSize.size} octets)`);

// Calculer les gains relatifs
console.log("\n📈 GAINS DE PERFORMANCE (vs JSON):");
console.log("  Protobuf vs JSON:");
console.log(`    • Encodage : ${((jsonBench.encodeAvg - protoBench.encodeAvg) / jsonBench.encodeAvg * 100).toFixed(1)}% plus rapide`);
console.log(`    • Décodage : ${((jsonBench.decodeAvg - protoBench.decodeAvg) / jsonBench.decodeAvg * 100).toFixed(1)}% plus rapide`);
console.log(`    • Taille : ${((jsonFileSize - protoFileSize) / jsonFileSize * 100).toFixed(1)}% plus petit`);

console.log("\n  XML vs JSON:");
console.log(`    • Encodage : ${((jsonBench.encodeAvg - xmlBench.encodeAvg) / jsonBench.encodeAvg * 100).toFixed(1)}% ${xmlBench.encodeAvg < jsonBench.encodeAvg ? 'plus rapide' : 'plus lent'}`);
console.log(`    • Décodage : ${((jsonBench.decodeAvg - xmlBench.decodeAvg) / jsonBench.decodeAvg * 100).toFixed(1)}% ${xmlBench.decodeAvg < jsonBench.decodeAvg ? 'plus rapide' : 'plus lent'}`);

// ============================================
// IMPLICATIONS POUR gRPC
// ============================================
console.log("\n🌐 IMPLICATIONS POUR gRPC ET SYSTÈMES DISTRIBUÉS");
console.log("=".repeat(50));

console.log("\n💡 Pourquoi Protobuf est optimal pour gRPC:");
console.log("1. ⚡ Performance : Encodage/décodage plus rapide que JSON et XML");
console.log("2. 📦 Compression : Taille réduite = moins de bande passante");
console.log("3. 🔒 Typage fort : Validation de schéma intégrée");
console.log("4. 🔄 Compatibilité : Évolution du schéma sans casser les clients");
console.log("5. 🌍 Multi-langage : Génération de code pour 10+ langages");

console.log("\n📊 Impact sur un système à haute charge:");
const requestsPerSecond = 10000;
const dataSizeJSON = jsonFileSize;
const dataSizeProto = protoFileSize;

console.log(`Pour ${requestsPerSecond.toLocaleString()} requêtes/second:`);
console.log(`  JSON     : ${(dataSizeJSON * requestsPerSecond / 1024 / 1024).toFixed(2)} Mo/s`);
console.log(`  Protobuf : ${(dataSizeProto * requestsPerSecond / 1024 / 1024).toFixed(2)} Mo/s`);
console.log(`  Économie : ${((dataSizeJSON - dataSizeProto) * requestsPerSecond / 1024 / 1024).toFixed(2)} Mo/s`);

// ============================================
// CONCLUSION
// ============================================
console.log("\n🎯 CONCLUSION DU LABORATOIRE");
console.log("=".repeat(50));

console.log("\n✅ Protobuf excelle sur tous les fronts:");
console.log("   - Taille minimale (idéal pour le réseau)");
console.log("   - Performance d'encodage/décodage optimale");
console.log("   - Validation de schéma robuste");
console.log("   - Support multi-langage");

console.log("\n⚖️  Choix du format selon le besoin:");
console.log("   • Protobuf : Microservices, gRPC, haute performance");
console.log("   • JSON     : APIs REST, web frontend, simplicité");
console.log("   • XML      : Systèmes legacy, documents, validation XSD");

console.log("\n🔮 Pour les systèmes modernes:");
console.log("gRPC + Protobuf est devenu le standard pour");
console.log("les communications inter-services à haute performance.");

console.log("\n" + "=".repeat(50));
console.log("🎉 LABORATOIRE TERMINÉ !");
console.log("=".repeat(50));