export class GlobalConstants {
  public static genericError: string = 'something went wrong';
  public static unauthorized: string = 'you are not authorized';
  public static productExistError: string = 'Product already exist';
  public static productAdded: string = 'Product Added Successfully';

  public static nameRegex: string = '[a-zA-Z0-9 ]*';
  public static emailRegex: string =
    '[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}';
  public static contactNumberRegex: string = '^[e0-9]{10,10}$';

  public static error: string = 'error';
}
