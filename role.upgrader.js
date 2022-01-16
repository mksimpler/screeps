var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            creep.say('🔄');
	    }
	    if(!creep.memory.working && creep.store.getFreeCapacity() == 0) {
	        creep.memory.working = true;
            creep.say('⚡');
	    }

	    if(creep.memory.working) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            var container = findNearest(creep, FIND_STRUCTURES, {
                filter: structure => {
                    return structure.structureType == STRUCTURE_CONTAINER &&
                            structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (container) {
                creepWithdraw(creep, container);
            }
            else {
                var source = findNearest(creep, FIND_SOURCES);
                creepHarvest(creep, source);
            }
        }
	},

    /** @param {Spawn} spawn **/
    assembly: function (spawn) {
        var newName = 'Upgrader' + Game.time;
        var result = spawn.spawnCreep([WORK,CARRY,MOVE], newName, 
            { memory: {role: 'upgrader'} }
        );
        if (result == OK) console.log('Spawning new upgrader: ' + newName);
    }
};

module.exports = roleUpgrader;