export class Uuid {
    public static v4 =() =>{
        return crypto.randomUUID()
    }
}