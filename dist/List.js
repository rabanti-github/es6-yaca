"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IteratorItem_1 = require("./IteratorItem");
var Sorter_1 = require("./Sorter");
/**
 * Class representing a standard ArrayList for generic Types with various List operations
 */
var List = (function () {
    function List(values) {
        this._iCounter = 0;
        this._length = 0;
        this._iList = [];
        if (values != undefined) {
            if (Array.isArray(values)) {
                this.addRange(values);
            }
            else if (values instanceof List) {
                this.addRange(values);
            }
            else {
                this.add(values);
            }
        }
    }
    Object.defineProperty(List.prototype, "length", {
        /**
         * Gets the number of elements of the List
         */
        get: function () {
            this._length = Object.keys(this._iList).length;
            return this._length;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Adds an element at the end of the List
     * @param value Value to add
     */
    List.prototype.add = function (value) {
        this._iList[this._length] = value;
        this._length++;
    };
    List.prototype.addRange = function (values) {
        if (Array.isArray(values)) {
            for (var i = 0; i < values.length; i++) {
                this.add(values[i]);
            }
        }
        else {
            for (var i = 0; i < values.length; i++) {
                this.add(values.get(i));
            }
        }
    };
    /**
     * Updates a value of the List at the specified index position
     * @param index Index position (0 to n)
     * @param value New value
     */
    List.prototype.set = function (index, value) {
        if (index < 0 || index > this._length - 1) {
            throw new Error("The index " + index + " is out of range.");
        }
        this._iList[index] = value;
    };
    /**
     * Inserts a new value at the bottom position of the List (index position 0)
     * @param value Value to insert
     */
    List.prototype.push = function (value) {
        this.insertAtIndex(0, value);
    };
    /**
     * Inserts a new value at the top position of the List (end position / last element). This method is synonymous with add()
     * @param value Value to insert
     */
    List.prototype.enqueue = function (value) {
        this.add(value);
    };
    /**
     * Inserts a new value at the defined index position. All values above (index +1) will be shifted to the next higher index. The last item of the List will be shifted to a new value
     * @param index Index position where to insert the value
     * @param value Value to insert
     */
    List.prototype.insertAtIndex = function (index, value) {
        if (index < 0 || index > this._length) {
            throw new Error("The index " + index + " is out of range.");
        }
        var firstPart, secondPart;
        if (index == 0) {
            firstPart = [];
        }
        else {
            firstPart = this.copyToInternal(0, index - 1, true);
        }
        if (index == this._length) {
            secondPart = [];
        }
        else {
            secondPart = this.copyToInternal(index, this._length - 1, true);
        }
        this.clear();
        var len = firstPart.length;
        var len2 = secondPart.length;
        this.addRange(firstPart);
        this.add(value);
        this.addRange(secondPart);
    };
    /**
     * Removes the passed value at the first occurrence in the List
     * @param value Value to remove
     */
    List.prototype.remove = function (value) {
        if (this._length == 0) {
            return false;
        }
        var oIndex = this.indexOf(value);
        if (oIndex < 0) {
            return false;
        }
        else {
            var indices = new List(oIndex);
            this.removeAtIndices(indices);
            return true;
        }
    };
    /**
     * Removes the passed value at all positions in the List
     * @param value Value to remove
     */
    List.prototype.removeAll = function (value) {
        if (this._length == 0) {
            return false;
        }
        var indices = this.indicesOfAsList(value);
        if (indices.length == 0) {
            return false;
        }
        else {
            this.removeAtIndices(indices);
            return true;
        }
    };
    /**
     * Removes the value at the defined index. All values above will be shifted one index position down (index - 1)
     * @param index Index where to remove a value
     */
    List.prototype.removeAt = function (index) {
        var i = new List(index);
    };
    List.prototype.removeAtIndices = function (indices) {
        var list;
        if (Array.isArray(indices)) {
            list = new List(indices);
        }
        else {
            list = indices;
        }
        var iLen = list.length;
        if (this._length == 0 || iLen == 0) {
            return;
        }
        var newList = new List();
        for (var i = 0; i < this._length; i++) {
            if (list.contains(i)) {
                continue;
            }
            newList.add(this._iList[i]);
        }
        this.clear();
        this._iList = newList.copyToArray();
        this._length = this.length;
    };
    /**
     * Removes the bottom element of the List and returns its value (index position 0). undefined will be returned if the List is empty
     */
    List.prototype.pop = function () {
        if (this._length == 0) {
            return undefined;
        }
        var value = this._iList[0];
        this.removeAt(0);
        return value;
    };
    /**
     * Removes the top element of the List and returns its value (end position / last element). undefined will be returned if the List is empty
     */
    List.prototype.dequeue = function () {
        if (this._length == 0) {
            return undefined;
        }
        var value = this._iList[this._length - 1];
        this.removeAt(this._length - 1);
        return value;
    };
    /**
     * Removes all elements of the List
     */
    List.prototype.clear = function () {
        if (this._length == 0) {
            return;
        }
        else {
            this._iList = [];
            this._length = 0;
        }
    };
    /**
     * Gets the value of the List at the specified index position
     * @param index Index position (0 to n)
     */
    List.prototype.get = function (index) {
        var value = this._iList[index];
        if (value != undefined) {
            return value;
        }
        else {
            throw new Error("The index " + index + " was not found in the List");
        }
    };
    List.prototype.getRange = function (start, end) {
        if (start == undefined) {
            start = 0;
        }
        if (end == undefined) {
            end = this._length - 1;
        }
        return this.copyToInternal(start, end, false);
    };
    List.prototype.copyToArray = function (start, end) {
        if (start == undefined) {
            start = 0;
        }
        if (end == undefined) {
            end = this._length - 1;
        }
        return this.copyToInternal(start, end, true);
    };
    /**
     * Gets the index of the first occurrence of the passed value
     * @param value Value to check
     */
    List.prototype.indexOf = function (value) {
        return this._iList.indexOf(value);
    };
    /**
     * Gets the index of the last occurrence of the passed value
     * @param value Value to check
     */
    List.prototype.lastIndexOf = function (value) {
        var indices = this.indicesOfAsList(value);
        var len = indices.length;
        if (len == 0) {
            return -1;
        }
        return indices.get(len - 1);
    };
    /**
     * Gets an Array of the indices of all occurrences of the passed value
     * @param value Value to check
     */
    List.prototype.indicesOf = function (value) {
        return this.indicesOfInternal(value, false);
    };
    /**
     * Gets a List of the indices of all occurrences of the passed value
     * @param value Value to check
     */
    List.prototype.indicesOfAsList = function (value) {
        return this.indicesOfInternal(value, true);
    };
    /**
     * Internal method to get the indices of a value in the List
     * @param value Value to check
     * @param asList If true, a List of indices will be returned, otherwise an Array
     */
    List.prototype.indicesOfInternal = function (value, asList) {
        var indices = new List();
        for (var i = 0; i < this._length; i++) {
            if (this._iList[i] === value) {
                indices.add(i);
            }
        }
        if (asList != undefined && asList == true) {
            return indices;
        }
        else {
            return indices.copyToArray();
        }
    };
    /**
     * Check whether the List contains the specified value
     * @param value True if the value exists, otherwise false
     */
    List.prototype.contains = function (value) {
        if (this._length == 0) {
            return false;
        }
        var index = this.indexOf(value);
        if (index < 0) {
            return false;
        }
        else {
            return true;
        }
    };
    /**
     * Internal method to copy a range of values in the List to a List or Array
     * @param start Start index
     * @param end End Index
     * @param toArray If true, an Array will be returned, otherwise a List
     */
    List.prototype.copyToInternal = function (start, end, toArray) {
        if (start < 0 || start > end) {
            throw new Error("The passed start index " + start + " is out of range");
        }
        if (end < start || end > this._length - 1) {
            throw new Error("The passed end index " + end + " is out of range");
        }
        var output;
        if (toArray == true) {
            output = new Array(end - start + 1);
        }
        else {
            output = new List();
        }
        var counter = 0;
        for (var i = start; i <= end; i++) {
            if (toArray == true) {
                output[counter] = this._iList[i];
                counter++;
            }
            else {
                output.add(this._iList[i]);
            }
        }
        return output;
    };
    /**
     * Method to reverse the List
     */
    List.prototype.reverse = function () {
        if (this._length == 0) {
            return;
        }
        var halfLength = Math.floor(this._length / 2);
        var i1 = 0;
        var i2 = this._length - 1;
        var temp = new Object;
        for (var i = 0; i < halfLength; i++) {
            this.swapValuesInternal(i1, i2, temp);
            i1++;
            i2--;
        }
    };
    /**
     * Swaps the values at the two defined index positions in the List
     * @param index1 Index position 1
     * @param index2 Index position 1
     */
    List.prototype.swapValues = function (index1, index2) {
        if (index1 < 0 || index1 > this._length - 1 || index2 < 0 || index2 > this._length - 1) {
            throw new Error("The passed indices (" + index1 + ", " + index2 + ") are out of range");
        }
        var temp = new Object;
        this.swapValuesInternal(index1, index2, temp);
    };
    /**
     * Internal method to swap the values at the two defined index positions in the List. The method performs no validation and uses a predefined variable as temporary variable
     * @param index1 Index position 1
     * @param index2 Index position 1
     * @param tempParameter Temporary variable (Define it once outside of this method)
     */
    List.prototype.swapValuesInternal = function (index1, index2, tempParameter) {
        tempParameter = this._iList[index1];
        this._iList[index1] = this._iList[index2];
        this._iList[index2] = tempParameter;
    };
    /**
     * Removes all duplicates of values in the List. All duplicates after the first occurrence of each value will be removed
     */
    List.prototype.distinct = function () {
        if (this._length == 0) {
            return;
        }
        var newList = new List();
        for (var i = 0; i < this._length; i++) {
            if (newList.contains(this._iList[i]) == false) {
                newList.add(this._iList[i]);
            }
        }
        this.clear();
        this.addRange(newList);
    };
    // *********************************************** Implemented Interfaces
    /**
     * Sorts the List according to the passed function
     * @param sortFunction Function which compares two values of the type T. If value 1 is smaller than value 2, -1 has to be returned. If value 1 is bigger than value 2, 1 has to be returned. If both values are equal, 0 has to be returned.
     */
    List.prototype.sort = function (sortFunction) {
        var qSort = new Sorter_1.Sorter();
        qSort.quickSort(sortFunction, this._iList, 0, this._length);
    };
    /**
     * Implementation of a forEach loop
     * @param callback Callback function to process the items of the List
     */
    List.prototype.forEach = function (callback) {
        var done = false;
        var item;
        this._iCounter = 0;
        while (done == false) {
            item = this.next();
            done = item.isLastEntry;
            callback(item.value);
        }
    };
    /**
     * Method to get the next value of an iterator. If the last item of the List is reached, the returned object indicates that the iterations are finished. Afterwards, the method starts again at index position 0. Calling of the forEach method will also reset the position to 0.
     * @param value Can be ignored
     */
    List.prototype.next = function (value) {
        var val = this._iList[this._iCounter];
        var lastItem;
        if (this._iCounter < this.length - 1) {
            this._iCounter++;
            lastItem = false;
        }
        else {
            this._iCounter = 0;
            lastItem = true;
        }
        return new IteratorItem_1.IteratorItem(val, lastItem);
    };
    return List;
}());
exports.default = List;
//# sourceMappingURL=List.js.map