const archiver = require('archiver');
const fs = require('fs');

let settings = process.argv[2];
let exclude = [];
let target;
let name = 'export';
try {
    settings = JSON.parse(settings);
    target = settings.target;
    exclude = settings.exclude;
    name = settings.name;
} catch { }

switch (target) {
    case 'mcaddon':
    case 'addon':
        exportAddon(exclude);
        break;
    case 'mcworld':
    case 'world':
        exportWorld(false);
        break;
    case 'mctemplate':
    case 'template':
        exportWorld(true);
        break;
    default:
        console.warn('No export target selected');
        break;
}

function exportAddon(exclude) {
    const outputAddon = fs.createWriteStream(`../../build/${name}.mcaddon`, 'utf-8');
    const archiveAddon = archiver('zip', { zlib: { level: 9 } });

    ['bp', 'rp'].filter(x => !exclude.some(y => y.toLowerCase() == x)).forEach(x => { archiveAddon.directory(x.toUpperCase(), x.toLowerCase()); });
    archiveAddon.on('error', err => console.error(err));
    archiveAddon.pipe(outputAddon);
    archiveAddon.finalize();
}

function exportWorld(template = false) {
    const bp = JSON.parse(fs.readFileSync("BP/manifest.json"))
    const rp = JSON.parse(fs.readFileSync("RP/manifest.json"))

    const header_rp = [{ "pack_id": rp.header.uuid, "version": rp.header.version }]
    const header_bp = [{ "pack_id": bp.header.uuid, "version": bp.header.version }]

    fs.writeFileSync("world_resource_packs.json", JSON.stringify(header_rp))
    fs.writeFileSync("world_behavior_packs.json", JSON.stringify(header_bp))

    const outputWorld = fs.createWriteStream(`../../build/${name}.` + (template ? 'mctemplate' : 'mcworld'), 'utf-8');
    const worldArchive = archiver('zip', { zlib: { level: 9 } });

    worldArchive.directory('BP/', 'behavior_packs/bp');
    worldArchive.directory('RP/', 'resource_packs/rp');

    worldArchive.directory('../../packs/WT/db/', 'db/');
    worldArchive.file('../../packs/WT/level.dat', { name: 'level.dat' });
    worldArchive.file('../../packs/WT/levelname.txt', { name: 'levelname.txt' });
    worldArchive.file('../../packs/WT/world_icon.jpeg', { name: 'world_icon.jpeg' });
    worldArchive.file('world_resource_packs.json', { name: 'world_resource_packs.json' });
    worldArchive.file('world_behavior_packs.json', { name: 'world_behavior_packs.json' });

    if (template) {
        worldArchive.directory('../../packs/WT/texts/', 'texts/');
        worldArchive.file('../../packs/WT/manifest.json', { name: 'manifest.json' });
    }
    worldArchive.on('error', err => console.error(err));
    worldArchive.pipe(outputWorld);
    worldArchive.finalize();
}
