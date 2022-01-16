var roleMaintainer = {

    /** @param {Creep} creep **/
    run: function (creep) {

        var damagedStructures = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.hits < structure.hitsMax &&
                        (structure.hits / structure.hitsMax < 0.6 ||
                        structure.hits < 3000)
            }
        }).sort((a, b) => a.hits - b.hits);

        if (damagedStructures.length) {
            if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
                creep.memory.working = false;
                creep.say('🔄');
            }
            if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
                creep.memory.working = true;
                creep.say('🚧');
            }

            if (creep.memory.working) {
                if (creep.repair(damagedStructures[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(damagedStructures[0], {visualizePathStyle: {stroke: '#ffaa00'}});
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

            
        }
    },

    /** @param {Spawn} spawn **/
    assembly: function (spawn) {
        var newName = 'Maintainer' + Game.time;
        var result = spawn.spawnCreep([WORK,CARRY,MOVE], newName, 
            { memory: {role: 'maintainer'} }
        );
        if (result == OK) console.log('Spawning new maintainer: ' + newName);
    }
};

module.exports = roleMaintainer;