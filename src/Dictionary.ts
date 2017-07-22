import IForEachInterface from './interfaces/IForEachInterfaceDictionary';
import {KeyValuePair} from './KeyValuePair';
import ISortInterFace from './interfaces/ISortInterface';
import { IDictionary } from './interfaces/IDictionary';
import { IteratorItem } from './IteratorItem';
import { Sorter } from './Sorter';
import  List  from './List';
var isEqual  = require('lodash.isequal');

/**
 * Class representing a standard Dictionary (Key and Value pairs) for generic Types with various Dictionary operations
 */
export class Dictionary<K,V> implements  Iterator<V>, IDictionary<K,V>
{


// ############### P R I V A T E   V A R I A B L E S ###############
    private _iDict: object;
    private _length: number;
    private _iCounter: number;
    private _iKeyIndex: string[];
    private _iOverrideToStringFunction: any;


// ############### P R O P E R T I E S ###############

    /**
     * Gets the number of elements of the Dictionary
     */
    public get length(): number {
        this._length = this._iKeyIndex.length;
        return this._length;
    }

// ############### C O N S T R U C T O R S ###############

/** Default constructor */
    constructor();

    /**
     * Constructor with an function to override the default hashing function of the keys (toString)
     * @param overrideFunction Hashing function. Should accept one parameter of the type K and return a string
     */
    constructor(overrideFunction: Function);
    /**
     * Constructor with a Dictionary<K,V> as initial value
     * @param values Dictionary of elements with K and V as Keys and Values 
     */
    constructor(values: Dictionary<K,V>);
    /**
     * Constructor with initial value
     * @param value Value of type V
     * @param key Key of Type K
     */
    constructor(key: K, value: V);
    /**
     * Constructor with two arrays of the same length as initial value
     * @param values Array of values with type V
     * @param keys Array of keys with type K
     */
    constructor(keys: K[], values: V[]);
    /**
     * Constructor with two Lists of the same length as initial value
     * @param values List of values with type V
     * @param keys List of keys with type K
     */
    constructor(keys: List<K>, values: List<V>);    
    constructor(keys?: K | K[] | List<K> | Dictionary<K, V> | Function, values?: V | V[] | List<V>) {
        this._iCounter = 0;
        this._length = 0;
        this._iDict = [];
        this._iKeyIndex = [];
        if (keys !== undefined) 
        {
            if (values !== undefined)
            {
                if (Array.isArray(keys) && Array.isArray(values)) {
                    this.addRange(keys as K[], values);
                }
                else if (keys instanceof List && values instanceof List) {
                    this.addRange(keys as List<K>, values as List<V>);
                }
                else {
                this.add(keys as K, values as V);
                }
            }
            else
            {
                if (keys instanceof Function)
                {
                    this.overrideHashFunction(keys as Function);
                }
                else if (keys instanceof Dictionary)
                {
                    this.addRange(keys as Dictionary<K,V>);
                }
            }
        }
    }

// ############### P U B L I C   F U N C T I O N S ###############

    /**
     * Adds an element at the end of the List. This method is synonymous to set
     * @param value Value to add
     * @param key Key to add
     */
    public add(key: K, value: V)
    {
        this.addInternal(key, value);
        this.refreshKeyIndex();
    }  

    /**
     * Adds a range of keys and values
     * @param values Values as Dictionary<K,V>
     */
    public addRange(values: Dictionary<K, V>);
    /**
     * Adds a range of keys and values
     * @param values Values as array of the type V
     * @param keys Keys as array of Type K
     */
    public addRange(keys: K[], values: V[]);
    /**
     * Adds a range of keys and values as Lists of the same length
     * @param values Values as List<V>
     * @param keys Keys as List<K>
     */
    public addRange(keys: List<K>, values: List<V>);    
    public addRange(p1: Dictionary<K,V> | K[] | List<K>, p2?: V[] | List<V>) {
        let keys: K[];
        let values: V[];
        if (Array.isArray(p1) && Array.isArray(p2))
        {
            keys = p1 as K[];
            values = p2 as V[];
        }
        else if (p1 instanceof List && p2 instanceof List)
        {
            keys = p1.copyToArray();
            values = p2.copyToArray();
        }
        else if (p1 instanceof Dictionary)
        {
            keys = p1.getKeys();
            values = p1.getValues();
        }
        else
            {
                keys = [];
                values = [];
            }
        if (keys.length !== values.length)
        {
            throw new Error("The length of the passed key and value arrays / lists is not identical")
        }
        let len: number = keys.length;
        for(let i: number = 0; i < len; i++)
        {
            this.addInternal(keys[i], values[i]);
        }
        this.refreshKeyIndex();
    }

    /**
     * Removes all elements of the Dictionary
     */
    public clear() {
        if (this._length === 0) { return; }
        else {
            this._iDict = [];
            this._length = 0;
            this._iKeyIndex = [];
        }
    }

    /**
     * Check whether the Dictionary contains the specified key
     * @param key Key to check
     */
    public containsKey(key: K): boolean {
        if (this._length === 0) { return false; }

        let keyList: K[] = [ key ];
        return this.containsKeys(keyList);
    }

    /**
     * Check whether the Dictionary contains the specified keys. True will be returned if at least one entry is existing
     * @param keys Key to check
     */
    public containsKeys(keys: K[], all?: boolean): boolean
        /**
     * Check whether the Dictionary contains the specified keys. True will be returned if at least one entry is existing
     * @param keys Key to check
     */
    public containsKeys(keys: List<K>, all?: boolean): boolean
    /**
     * Check whether the Dictionary contains the specified keys
     * @param keys Key to check
     * @param all If true, the function will return true only if all entries are existing, otherwise true will be returned if at least one entry is existing
     */
    public containsKeys(keys: List<K>, all?: boolean): boolean;
    public containsKeys(keys: List<K> | K[], all?: boolean): boolean
    {
        if (this._length === 0) { return false; }
        let keyList: K[];
        let match: number = 0;
        if (Array.isArray(keys))
        { keyList = keys; }
        else
        { keyList = (keys as List<K>).copyToArray(); }
        let len: number = keys.length;
       // let allHashcodes: string[] = Object.keys(this._iDict);
        for(let i: number = 0; i < len; i++)
        {
            if (this._iDict[this.getHashCode(keyList[i])] !== undefined )
            { match++; }
        }
        if (all !== undefined && all === true)
        {
            if (match === len) { return true; }
            else { return false; }
        }
        else
        {
            if (match > 0) { return true; }
            else { return false; }            
        }
    }    

    /**
     * Check whether the Dictionary contains the specified value
     * @param value Values to check
     */
    public containsValue(value: V): boolean
    {
       let v: V[] = [value];
       let list: List<K> = this.getKeysByValuesAsListInternal(v, false);
       if (list.length > 0) { return true; }
       else { return false; }
    }    

     /**
     * Check whether the Dictionary contains the specified values. True will be returned if at least one entry is existing
     * @param keys Key to check
     * @param all If true, the function will return true only if all entries are existing, otherwise true will be returned if at least one entry is existing
     */
    public containsValues(values: V[], all?: boolean): boolean;
     /**
     * Check whether the Dictionary contains the specified values. True will be returned if at least one entry is existing
     * @param keys Key to check
     * @param all If true, the function will return true only if all entries are existing, otherwise true will be returned if at least one entry is existing
     */    
    public containsValues(values: List<V>, all?: boolean): boolean;
    public containsValues(values: V[] | List<V>, all?: boolean): boolean
    {
        let list: List<K>;
        if (all !== undefined && all === true)
        {
            list = this.getKeysByValuesAsListInternal(values, true);
            if (list.length === values.length) { return true; }
            else { return false; }             
        }
        else
        {
            list = this.getKeysByValuesAsListInternal(values, false);
            if (list.length > 0) { return true; }
            else { return false; }      
        }  
    }

    /**
     * Removes all duplicates of values in the Dictionary. The keys of the remaining values cannot be determined
     */
    public distinct() {
        if (this._length === 0) { return; }
        let newDict: Dictionary<K,V> = new Dictionary<K,V>();
        for (let i = 0; i < this._length; i++) {
            if (newDict.containsValues([this._iDict[this._iKeyIndex[i]][1]]) === false)
            {
                newDict.add(this._iDict[this._iKeyIndex[i]][0], this._iDict[this._iKeyIndex[i]][1]);
            }
        }
        this.clear()
        this.addRange(newDict);
    }

     // >>> I N T E R F A C E    I M P L E M E N T A T I O N <<<
    /**
     * Implementation of a forEach loop
     * @param callback Callback function to process the items of the List
     */
    public forEach(callback: IForEachInterface<K,V>) {
        if (this._length === 0) { return; }
        let done: boolean = false;
        let item: IteratorItem<KeyValuePair<K,V>>;
        this._iCounter = 0;
        while (done === false) {
            item = this.next() as IteratorItem<KeyValuePair<K,V>>;
            done = item.isLastEntry;
            callback(item.value);
        }
    }

    /**
     * Gets the value of the Dictionary by the specified key
     * @param key Key
     */
    public get(key: K): V {
        let k: string = this.getHashCode(key);
        if (typeof this._iDict[k] !== undefined) {
            return this._iDict[k][1];
        }
        else {
            throw new Error("The key " + key + " was not found in the Dictionary");
        }
    }

    /**
     * Gets all key of the Dictionary as Array of the type K
     */
    public getKeys(): K[]
    {
        
        if (this._length === 0) { return new Array() as K[]; }
        let temp: object[] = this.getKeyValuePairsInternal();
        let output: K[] = Array(temp.length);

        for(let i: number = 0; i < this._length; i++)
        {
            output[i] = temp[i]['value'][0];
        }
        return output;
    }

    /**
     * Gets all keys of the Dictionary as List of teh type <K>
     */
    public getKeysAsList(): List<K>
    {
        let keys: K[] = this.getKeys();
        return new List<K>(keys);
    }

    /**
     * Get the keys that matches to the passed value
     * @param value Value to get all corresponding keys from
     */
    public getKeysByValue(value: V): K[]
    { 
        let list: List<K> = this.getKeysByValueAsList(value);
        return this.getKeysByValuesAsListInternal([ value ], true).copyToArray();
        //return list.copyToArray();
    }

    public getKeysByValueAsList(value: V): List<K>
    {
        //let v: V[] = [value];
        return this.getKeysByValuesAsListInternal([ value ], true); 
    }












    public getValues(): V[]
    {
        if (this._length === 0) { return new Array() as V[]; }
        let temp: object[] = this.getKeyValuePairsInternal();
        let output: V[] = Array(temp.length);

        for(let i: number = 0; i < this._length; i++)
        {
            output[i] = temp[i]['value'];
        }
        return output;
    }

    public getValuesAsList(): List<V>
    {
        let values: V[] = this.getValues();
        return new List<V>(values);
        
    }
    

    


    public getKeysByValuesAsList(values: V[]): List<K>;
    public getKeysByValuesAsList(values: List<V>): List<K>;
    public getKeysByValuesAsList(values: V[] | List<V>): List<K>
    {
        return this.getKeysByValuesAsListInternal(values, false);
    }

    public getKeysByValues(values: V[]): K[];
    public getKeysByValues(values: List<V>): K[];
    public getKeysByValues(values: V[] | List<V>): K[]
    {
        let list: List<K> = this.getKeysByValuesAsListInternal(values, false);
        return list.copyToArray();     
    }









    




    


    public overrideHashFunction(overrideFunction: Function): void
    {
        let type: any = {};
        if ((overrideFunction && type.toString.call(overrideFunction) === '[object Function]') === false)
        {
            throw new Error("The passed object is not a function. It must be a function that accepts one variable of the key type (K) and returns a string");
        }
        this._iOverrideToStringFunction = overrideFunction;
    }




    /**
     * Updates a value of the Dictionary with the specified key. If the key does not exist, it will be added. This method is synonymous to add
     * @param key Key of the new value
     * @param value New value
     */
    public set(key: K, value: V) {
        this.add(key, value);
    }


    /**
     * Removes the passed key in the Dictionary. The method returns true if the key was found and removed, otherwise false
     * @param key Key (and attached value) to remove
     */
    public remove(key: K): boolean;
       /**
     * Removes the passed keys in the Dictionary. The method returns true if at least one key was found and removed, otherwise false
     * @param keys Keys (and attached values) to remove
     */
    public remove(keys: K[]): boolean;        
    /**
     * Removes the passed keys in the Dictionary. The method returns true if at least one key was found and removed, otherwise false
     * @param keys Keys (and attached values) to remove
     */
    public remove(keys: List<K>): boolean;
    public remove(keys: K | K[] | List<K>): boolean
    {
        if (this._length === 0) { return false; }
        let keylist: K[];
        if (Array.isArray(keys))
        {
            keylist = keys;
        }
        else if (keys instanceof List)
        {
            keylist = keys.copyToArray();
        }
        else
        {
            keylist = [ keys ];
        }

        //let hashcode: string;
        let len: number = keylist.length;
        let status: boolean = false;
        let status2: boolean = false;
        for(let i = 0; i < len; i++)
        {
            status2 = this.removeInternal(keylist[i]);
            if (status2 === true) { status = true; }
            //hashcode = this.getHashCode(keylist[i]);
        }
        this.refreshKeyIndex();
        return status;
    }


    

/*
    public removeByValue(value: V): boolean
    {
        if (this.length < 1) { return false; }

        let keys: List<K> = this.getKeysByValueAsList(value);
        let len: number = keys.length;
        let status: boolean = false;
        let status2: boolean;
        if (len === 0) { return false; }

        return this.remove(keys);
    }
*/

    /**
     * Removes all entries with the passed value from the Dictionary.
     * @param values Value to remove
     */
    public removeByValue(value: V): boolean;
    /**
     * Removes all entries with the passed values from the Dictionary.
     * @param values Array of values to remove
     */
    public removeByValue(values: V[]): boolean;
    /**
     * Removes all entries with the passed values from the Dictionary.
     * @param values List of values to remove
     */
    public removeByValue(values: List<V>): boolean;
    public removeByValue(values: V | V[] | List<V>): boolean {
        if (this._length === 0) { return false; }
        let keys: List<K>;
        if (Array.isArray(values)  || values instanceof List)
        {
            keys  = this.getKeysByValuesAsListInternal(values, false);
        }
        else
        {
            keys = this.getKeysByValueAsList(values as V);
        }
        let len = keys.length;
        if (this._length === 0 || len === 0) { return false; }

        return this.remove(keys);
    }





    /**
     * Copies the whole Dictionary to a new Dictionary
     */
    public getRange(): Dictionary<K,V>;
    /**
     * Copies the Dictionary to a new Dictionary using the specified keys
     * @param keys Keys to use for the new Dictionary
     */
    public getRange(keys: K[]): Dictionary<K,V>;
        /**
     * Copies the Dictionary to a new Dictionary using the specified keys
     * @param keys Keys to use for the new Dictionary
     */
    public getRange(keys: List<K>): Dictionary<K,V>;
    public getRange(keys?: K[] | List<K>): Dictionary<K,V> {
        if (this._length === 0) { return new Dictionary<K,V>(); }
        //let allHashcodes: string[] = Object.keys(this._iDict);
        let hashcodes: List<string> = new List<string>();
        let temp: K[] = new Array();
        if (keys !== undefined && Array.isArray(keys))
        {
          temp = keys;
        }
        else if (keys !== undefined && (Array.isArray(keys) === false))
        {
          temp = (keys as List<K>).copyToArray();
        }
       // let len = allHashcodes.length;
        let len2 = temp.length;
        let j: number;
        for(let i: number = 0; i < this._length; i++)
        {
            if (keys === undefined)
            { 
                hashcodes.add(this._iKeyIndex[i]);
                continue;
            }
            for(j = 0; j<len2; j++)
            {
                if (this.getHashCode(temp[j]) === this._iKeyIndex[i])
                {
                    hashcodes.add(this._iKeyIndex[i]);
                    break;
                }
            }
        }
        if (keys !== undefined)
        {
            hashcodes.distinct();
        }
        return this.copyToInternal(hashcodes);
    }


    /**
     * Copies the Dictionary to a new Dictionary using the specified values. All occurrences will be transferred to the new Dictionary
     * @param values Values to use for the new Dictionary
     */
    public getRangeByValues(values: V[]): Dictionary<K,V>;
    /**
     * Copies the Dictionary to a new Dictionary using the specified values. All occurrences will be transferred to the new Dictionary
     * @param values Values to use for the new Dictionary
     */
    public getRangeByValues(values: List<V>): Dictionary<K,V>;
    public getRangeByValues(values: V[] | List<V>): Dictionary<K,V>
    {
         if (this._length === 0) { return new Dictionary<K,V>(); }
         let keys: List<K> = this.getKeysByValuesAsListInternal(values, false);
         return this.getRange(keys);       
    }







    /**
     * Swaps the values of the two defined keys in the Dictionary
     * @param key1 Key 1
     * @param key2 Key 2
     */
    public swapValues(key1: K, key2: K) {
        if (this.containsKey(key1) === false || this.containsKey(key2) === false) {
            throw new Error("One of the passed keys (" + key1.toString() + ", " + key2.toString() + ") does not exist");
        }
        let hc1: string = this.getHashCode(key1);
        let hc2: string = this.getHashCode(key2);
        let temp: V = this._iDict[hc1][1];
        this._iDict[hc1][1] = this._iDict[hc2][1];
        this._iDict[hc2][1] = temp;
        }



    // // *********************************************** Implemented Interfaces

    // /**
    //  * Sorts the List according to the passed function
    //  * @param sortFunction Function which compares two values of the type T. If value 1 is smaller than value 2, -1 has to be returned. If value 1 is bigger than value 2, 1 has to be returned. If both values are equal, 0 has to be returned.
    //  */
    // sort(sortFunction: ISortInterFace<T>) {
    //     let qSort: Sorter<T> = new Sorter();
    //     qSort.quickSort(sortFunction, this._iList as T[], 0, this._length);
    // }



    /**
     * Method to get the next value of an iterator. If the last item of the List is reached, the returned object indicates that the iterations are finished. Afterwards, the method starts again at index position 0. Calling of the forEach method will also reset the position to 0.
     * @param value Can be ignored
     */
    public next(value?: any): IteratorResult<KeyValuePair<K,V>> {
        let val: KeyValuePair<K,V> = new KeyValuePair(this._iDict[this._iKeyIndex[this._iCounter]][0], this._iDict[this._iKeyIndex[this._iCounter]][1]);
        let lastItem: boolean;
        if (this._iCounter < this.length - 1) {
            this._iCounter++;
            lastItem = false;
        }
        else {
            this._iCounter = 0;
            lastItem = true;
        }
        return new IteratorItem(val, lastItem);
    }

// ############### P R I V A T E   F U N C T I O N S ###############


    private addInternal(key: K, value: V)
    {
        if (key === undefined)
        {
            throw new Error("No key was defined to add as Dictionary element");
        }
        if (value === undefined)
        {
            throw new Error("No value was defined to add as Dictionary element");
        }        
        let hashcode: string = this.getHashCode(key);
        this._iDict[hashcode as string] = {0:key, 1:value};
        if (this._iKeyIndex.indexOf(hashcode as string) < 0)
        {
            this._length++;   
        }     
    }

    private copyToInternal(keys: List<string>): Dictionary<K,V>
    {
        let output: Dictionary<K,V> = new Dictionary<K,V>();
        let len = keys.length;
        for(let i: number = 0; i < len; i++)
        {
            if (typeof this._iDict[keys[i]] !== undefined)
            {
                output.addInternal(this._iDict[keys.get(i)][0], this._iDict[keys.get(i)][1]);
            }
        }
        output.refreshKeyIndex();
        return output;
    }

    private getHashCode(key: K): string
    {
        if (key === undefined)
        {
            throw new Error("No valid key was defined. The key must not be empty or undefined");
        }
        if (this._iOverrideToStringFunction === undefined)
        {      
            if (key instanceof Date) // Workaround for dates as common type (milliseconds are not considered in toString)
            {
                return (key as Date).getTime().toString();
            }
            else
            {
                return "_" + key.toString(); // _ prevents possible problems with empty strings / defined types
            }
        }
        else
        {
            return this._iOverrideToStringFunction(key);
        }
    }    
    
    private getKeysByValuesAsListInternal(values: V[] | List<V>, all: boolean): List<K>{
       let list: List<K> = new List<K>();
       if (this._length === 0) { return list; }

        let val: V[];
        if (Array.isArray(values))
        {
            val = values;
        }
        else
        {
            val = values.copyToArray();
        }
        let len: number = val.length;
        if (len === 0) { return list; }
       //let keys: string[] = Object.keys(this._iDict);
       //let len2: number = keys.length;
       let j: number;
       let keyCheck: List<string> = new List<string>();
        for(let i: number = 0; i < len; i++)
        {
            for(j = 0; j < this._length; j++)
            {
                if (isEqual(this._iDict[this._iKeyIndex[j]][1], val[i]) === true)
                {
                    if (keyCheck.contains(this._iKeyIndex[j])){ continue; }
                    list.add(this._iDict[this._iKeyIndex[j]][0]);
                    if (all === false) { return list; }
                    keyCheck.add(this._iKeyIndex[j]);
                }
            }
        }
        return list;
    }

    private getKeyValuePairsInternal(): object[]
    {
        let output: object[] = new Array(this._length) as object[];
        let item: object;
        let i: number = 0;
        //let keys: string[] = Object.keys(this._iDict);
        this._iKeyIndex.forEach(key => { 
            item = {'key': key, 'value': this._iDict[key]};
            output[i] = item;
            i++;
        });
        return output;
    }    

    private refreshKeyIndex()
    {
        this._iKeyIndex = Object.keys(this._iDict);
    }

    private removeInternal(key: K): boolean
    {
        let hashcode: string = this.getHashCode(key);
        if (typeof this._iDict[hashcode] === undefined)
        {
            return false;
        }
        else
        {
            delete this._iDict[hashcode];
            this._length--;
            return true;            
        }
    }    

}


