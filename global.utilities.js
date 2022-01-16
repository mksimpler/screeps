const STOKE_COLOR = '#ffaa00';

function distance (x1, y1, x2, y2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
}

Object.assign(global, {

    // Creep harvest
    creepHarvest: function (creep, target) {
        var result = creep.harvest(target);
        if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: STOKE_COLOR}});
        }
        
        return result;
    },

    // Creep transfer
    creepTransfer: function (creep, target, resourceType) {
        var result = creep.transfer(target, resourceType || RESOURCE_ENERGY);
        if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: STOKE_COLOR}});
        }

        return result;
    },

    // Creep withdraw
    creepWithdraw: function (creep, target, resourceType) {
        var result = creep.withdraw(target, resourceType || RESOURCE_ENERGY);
        if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: STOKE_COLOR}});
        }

        return result;
    },

    // Creep upgrade
    creepUpgrade: function (creep) {
        var result = creep.upgradeController(creep.room.controller);
        if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: STOKE_COLOR}});
        }

        return result;
    },

    // Creep build
    creepBuild: function (creep, target) {
        var result = creep.build(target);
        if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: STOKE_COLOR}});
        }

        return result;
    },

    // Creep repair
    creepRepair: function (creep, target) {
        var result = creep.repair(target);
        if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: STOKE_COLOR}});
        }

        return result;
    },

    // Find neareast object to creep
    findNearest: function (creep, type, opt) {
        var results = creep.room.find(type, opt);
        if (results.length) {
            return results.sort((a, b) => {
                var dA = distance(creep.pos.x, creep.pos.y, a.pos.x, a.pos.y);
                var dB = distance(creep.pos.x, creep.pos.y, b.pos.x, b.pos.y);
                return dA - dB;
            })[0];
        }

        return null;
    },

    // Calculate distance between 2 room objects
    calcDistance: function (roomObjectA, roomObjectB) {
        return distance(
            roomObjectA.pos.x,
            roomObjectA.pos.y,
            roomObjectB.pos.x,
            roomObjectB.pos.y
        );
    },

    // Find empty space around cell given by room object
    findEmptySpaces: function (roomObject) {
        var emptyCells = [];

        var plainCells = roomObject.room.lookAtArea(
            roomObject.pos.y - 1,
            roomObject.pos.x - 1,
            roomObject.pos.y + 1,
            roomObject.pos.x + 1,
            true
        ).filter(cell => {
            if (cell.x == roomObject.pos.x && cell.y == roomObject.pos.y) {
                return false;
            }
            else {
                return cell.type == 'terrain' && cell.terrain == 'plain';
            }
        });
        if (plainCells.length) {
            // Check if there is creep current on cell
            for (var cell of plainCells) {
                var occupied = roomObject.room.lookAt(cell.x, cell.y).filter(obj => {
                    switch (obj.type) {
                        case 'structure':
                            return obj.structure.structureType != STRUCTURE_ROAD;

                        case 'terrain':
                            return obj.terrain != 'plain';

                        case 'creep':
                            return obj.creep.memory.role == 'miner';

                        case 'tombstone':
                            return false;

                        default:
                            return true;
                    }
                }).length > 0;
                if (!occupied) {
                    emptyCells.push(cell);
                }
            }
        }

        return emptyCells;
    }
});

Store.prototype.getFreeCapacityPercentage = function () {
    return this.getUsedCapacity() / this.getCapacity();
};

Structure.prototype.getHitsPercentage = function () {
    return this.hits / this.hitsMax;
};