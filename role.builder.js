var roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {

	    if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            creep.say('🔄');
	    }
	    if(!creep.memory.working && creep.store.getFreeCapacity() == 0) {
	        creep.memory.working = true;
            creep.say('🚧');
	    }

	    if(creep.memory.working) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else {
                var damagedStructures = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax
                });
                if (damagedStructures.length) {
                    if (creep.repair(damagedStructures[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(damagedStructures[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
	    }
	    else {
            var storages = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return  structure.structureType == STRUCTURE_CONTAINER && 
                                structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            if (storages.length > 0) {
                if (creep.withdraw(storages[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storages[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            else {
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
	    }
	},

    /** @param {Spawn} spawn **/
    assembly: function (spawn) {
        var newName = 'Builder' + Game.time;
        var result = spawn.spawnCreep([WORK,CARRY,MOVE], newName, 
            { memory: {role: 'builder'} }
        );
        if (result == OK) console.log('Spawning new builder: ' + newName);
    }
};

module.exports = roleBuilder;