var roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
	    if (creep.store.getFreeCapacity() > 0) {
            if (Object.values(Game.creeps).filter(c => c.memory.role == 'miner').length) {
                // Got miner
                var container = findNearest(creep, FIND_STRUCTURES, {
                    filter: structure => {
                        return structure.structureType == STRUCTURE_CONTAINER &&
                                structure.store.getFreeCapacityPercentage() > 0.4;
                    }
                })
                if (container) {
                    creepWithdraw(creep, container);
                }
                else {
                    container = findNearest(creep, FIND_STRUCTURES, {
                        filter: structure => {
                            return structure.structureType == STRUCTURE_CONTAINER;
                        }
                    });

                    creepWithdraw(creep, container);
                }
            }
            else {
                var source = findNearest(creep, FIND_SOURCES);
                creepHarvest(creep, source);
            }
        }
        else {
            var storage = findNearest(creep, FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) && 
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });

            if (storage) {
                creepTransfer(creep, storage);
            }
            else {
                var containers = creep.room.find(FIND_STRUCTURES, {
                    filter: structure => {
                        return structure.structureType == STRUCTURE_CONTAINER;
                    }
                }).sort((a, b) => {
                    return a.store.getUsedCapacity() - b.store.getUsedCapacity();
                });

                if (containers.length) {
                    creepTransfer(creep, containers[0]);
                }
            }
        }
	},

    /** @param {Spawn} spawn **/
    assembly: function (spawn) {
        var newName = 'Harvester' + Game.time;
        var result = spawn.spawnCreep([WORK,CARRY,MOVE], newName, 
            { memory: {role: 'harvester'} }
        );
        if (result == OK) console.log('Spawning new harvester: ' + newName);
    }
};

module.exports = roleHarvester;