var roleMiner = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.store.getFreeCapacity() > 0) {
            var closestSources = creep.pos.findInRange(FIND_SOURCES, 1);
            if (!closestSources.length) {
                var sources = creep.room.find(FIND_SOURCES).sort((a, b) => {
                    var dA = calcDistance(creep, a);
                    var dB = calcDistance(creep, b);
                    return dA - dB;
                });
                for (var source of sources) {
                    var emptySpaces = findEmptySpaces(source);
                    if (emptySpaces.length) {
                        creepHarvest(creep, source);
                        break;
                    }
                }
            }
            else {
                creepHarvest(creep, closestSources[0]);
            }
        }
        else {
            var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                        return  structure.structureType == STRUCTURE_CONTAINER && 
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            if (container) {
                creep.transfer(container, RESOURCE_ENERGY);
            }
        }
    },

    /** @param {Spawn} spawn **/
    assembly: function (spawn) {
        var newName = 'Miner' + Game.time;
        var result = spawn.spawnCreep([WORK, WORK,CARRY,MOVE], newName, 
            { memory: {role: 'miner'} }
        );
        if (result == OK) console.log('Spawning new miner: ' + newName);
    }
};

module.exports = roleMiner;