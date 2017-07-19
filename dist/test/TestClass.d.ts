/**
 * Class for test purpose. The class contains several objects and can be used to test operations on complex / custom data types
 */
export declare class TestClass {
    private static counter;
    value1: string;
    value2: number;
    value3: boolean[];
    value4: Date;
    /**
     * Default constructor
     */
    constructor();
    /**
     * Creates a randomized instance of the class
     */
    static createRandomObject(): TestClass;
}
