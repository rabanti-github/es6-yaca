"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Types_1 = require("./Types");
var List_1 = require("../../src/List");
var Dictionary_1 = require("../../src/Dictionary");
/**
 * Utils class for testing
 */
var Utils = (function () {
    function Utils() {
        this.Types = Types_1.Types;
    }
    /**
     * Function to compare two numbers
     * @param n1 number 1 to compare
     * @param n2 number 2 to compare
     */
    Utils.compareNumbers = function (n1, n2) {
        if (n1 < n2) {
            return -1;
        }
        else if (n1 === n2) {
            return 0;
        }
        else {
            return 1;
        }
    };
    /**
     * Function to compare two Dates
     * @param d1 Date 1 to compare
     * @param d2 Date 2 to compare
     */
    Utils.compareDates = function (d1, d2) {
        var n1 = d1.getTime();
        var n2 = d2.getTime();
        return Utils.compareNumbers(n1, n2);
    };
    /**
     * Function to compare two booleans
     * @param b1 boolean 1 to compare
     * @param b2 boolean 2 to compare
     */
    Utils.compareBooleans = function (b1, b2) {
        if (b1 === false && b2 === true) {
            return -1;
        }
        else if ((b1 === false && b2 === false) || b1 === true && b2 === true) {
            return 0;
        }
        else {
            return 1;
        }
    };
    /**
     * Function to test an overwritten hash function for dates (used in Dictionary)
     * @param date Date to get the hash
     */
    Utils.properDateHashFunction = function (date) {
        return date.getTime().toString();
    };
    /**
     * Function to setup instances of the List class
     * @param t Type of the list
     * @param initialValue Initial value as single value or array (optional)
     */
    Utils.setupList = function (t, initialValue) {
        if (initialValue === undefined) {
            if (t === Types_1.Types.boolean) {
                return new List_1.default();
            }
            else if (t === Types_1.Types.date) {
                return new List_1.default();
            }
            else if (t === Types_1.Types.number) {
                return new List_1.default();
            }
            else if (t === Types_1.Types.string) {
                return new List_1.default();
            }
        }
        else {
            if (t === Types_1.Types.boolean) {
                return new List_1.default(initialValue);
            }
            else if (t === Types_1.Types.date) {
                return new List_1.default(initialValue);
            }
            else if (t === Types_1.Types.number) {
                return new List_1.default(initialValue);
            }
            else if (t === Types_1.Types.string) {
                return new List_1.default(initialValue);
            }
        }
    };
    Utils.setupDictionary = function (keyType, valueType, keys, values) {
        if (keys === undefined || values === undefined) {
            if (keyType === Types_1.Types.boolean && valueType === Types_1.Types.boolean) {
                return new Dictionary_1.Dictionary();
            }
            else if (keyType === Types_1.Types.boolean && valueType === Types_1.Types.date) {
                return new Dictionary_1.Dictionary();
            }
            else if (keyType === Types_1.Types.boolean && valueType === Types_1.Types.number) {
                return new Dictionary_1.Dictionary();
            }
            else if (keyType === Types_1.Types.boolean && valueType === Types_1.Types.string) {
                return new Dictionary_1.Dictionary();
            }
            else if (keyType === Types_1.Types.date && valueType === Types_1.Types.boolean) {
                return new Dictionary_1.Dictionary();
            }
            else if (keyType === Types_1.Types.date && valueType === Types_1.Types.date) {
                return new Dictionary_1.Dictionary();
            }
            else if (keyType === Types_1.Types.date && valueType === Types_1.Types.number) {
                return new Dictionary_1.Dictionary();
            }
            else if (keyType === Types_1.Types.date && valueType === Types_1.Types.string) {
                return new Dictionary_1.Dictionary();
            }
            else if (keyType === Types_1.Types.number && valueType === Types_1.Types.boolean) {
                return new Dictionary_1.Dictionary();
            }
            else if (keyType === Types_1.Types.number && valueType === Types_1.Types.date) {
                return new Dictionary_1.Dictionary();
            }
            else if (keyType === Types_1.Types.number && valueType === Types_1.Types.number) {
                return new Dictionary_1.Dictionary();
            }
            else if (keyType === Types_1.Types.number && valueType === Types_1.Types.string) {
                return new Dictionary_1.Dictionary();
            }
            else if (keyType === Types_1.Types.string && valueType === Types_1.Types.boolean) {
                return new Dictionary_1.Dictionary();
            }
            else if (keyType === Types_1.Types.string && valueType === Types_1.Types.date) {
                return new Dictionary_1.Dictionary();
            }
            else if (keyType === Types_1.Types.string && valueType === Types_1.Types.number) {
                return new Dictionary_1.Dictionary();
            }
            else if (keyType === Types_1.Types.string && valueType === Types_1.Types.string) {
                return new Dictionary_1.Dictionary();
            }
        }
        else {
            if (keyType === Types_1.Types.boolean && valueType === Types_1.Types.boolean) {
                return new Dictionary_1.Dictionary(keys, values);
            }
            else if (keyType === Types_1.Types.boolean && valueType === Types_1.Types.date) {
                return new Dictionary_1.Dictionary(keys, values);
            }
            else if (keyType === Types_1.Types.boolean && valueType === Types_1.Types.number) {
                return new Dictionary_1.Dictionary(keys, values);
            }
            else if (keyType === Types_1.Types.boolean && valueType === Types_1.Types.string) {
                return new Dictionary_1.Dictionary(keys, values);
            }
            else if (keyType === Types_1.Types.date && valueType === Types_1.Types.boolean) {
                return new Dictionary_1.Dictionary(keys, values);
            }
            else if (keyType === Types_1.Types.date && valueType === Types_1.Types.date) {
                return new Dictionary_1.Dictionary(keys, values);
            }
            else if (keyType === Types_1.Types.date && valueType === Types_1.Types.number) {
                return new Dictionary_1.Dictionary(keys, values);
            }
            else if (keyType === Types_1.Types.date && valueType === Types_1.Types.string) {
                return new Dictionary_1.Dictionary(keys, values);
            }
            else if (keyType === Types_1.Types.number && valueType === Types_1.Types.boolean) {
                return new Dictionary_1.Dictionary(keys, values);
            }
            else if (keyType === Types_1.Types.number && valueType === Types_1.Types.date) {
                return new Dictionary_1.Dictionary(keys, values);
            }
            else if (keyType === Types_1.Types.number && valueType === Types_1.Types.number) {
                return new Dictionary_1.Dictionary(keys, values);
            }
            else if (keyType === Types_1.Types.number && valueType === Types_1.Types.string) {
                return new Dictionary_1.Dictionary(keys, values);
            }
            else if (keyType === Types_1.Types.string && valueType === Types_1.Types.boolean) {
                return new Dictionary_1.Dictionary(keys, values);
            }
            else if (keyType === Types_1.Types.string && valueType === Types_1.Types.date) {
                return new Dictionary_1.Dictionary(keys, values);
            }
            else if (keyType === Types_1.Types.string && valueType === Types_1.Types.number) {
                return new Dictionary_1.Dictionary(keys, values);
            }
            else if (keyType === Types_1.Types.string && valueType === Types_1.Types.string) {
                return new Dictionary_1.Dictionary(keys, values);
            }
        }
    };
    return Utils;
}());
exports.Utils = Utils;
//# sourceMappingURL=Utils.js.map