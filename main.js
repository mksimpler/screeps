require('global.utilities');

var roles = {
    'harvester': {
        // Population
        pop: 2,

        // Toggle
        enable: true,

        // Handler module
        handler: require('role.harvester'),
    },

    'upgrader': {
        pop: 3,
        enable: true,
        handler: require('role.upgrader'),
    },

    'builder': {
        pop: 3,
        enable: true,
        handler: require('role.builder'),
    },

    'maintainer': {
        pop: 3,
        enable: true,
        handler: require('role.maintainer'),
    },

    'miner': {
        pop: 6,
        enable: true,
        handler: require('role.miner'),
    }
}

module.exports.loop = function () {

    // Print timestamp
    //console.log("Tick: " + Game.time);

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    if (Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    } else {
        for (var roleName in roles) {
            var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == roleName);
            var role = roles[roleName];

            if (role.enable) {
                if (creeps.length < role.pop) {
                    role.handler.assembly(Game.spawns['Spawn1']);
                    break;
                }
            }
            
        }
    }

    // Behaviors
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        var role = roles[creep.memory.role];

        if (role.enable) {
            role.handler.run(creep);
        }
        else {
            creep.moveTo(Game.spawns['Spawn1']);
        }
    }
}