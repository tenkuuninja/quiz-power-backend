import {
  registerDecorator,
  ValidatorOptions,
  ValidateIf,
  ValidationOptions,
} from 'class-validator';

interface IsFileOptions {
  mimeType?: string[];
}

export function IsFile(
  options: IsFileOptions = {},
  validationOptions?: ValidatorOptions,
) {
  return function (object: object, propertyName: string) {
    return registerDecorator({
      name: 'isFile',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (options?.mimeType) {
            for (const mimeType of options.mimeType) {
              const re = new RegExp(`^${mimeType?.replace('*', '.*')}$`, 'g');
              if (!re.test(value?.mimeType)) {
                return false;
              }
            }
          }
          return true;
        },
      },
    });
  };
}

export function IsFileArray(
  options: IsFileOptions = {},
  validationOptions?: ValidatorOptions,
) {
  return function (object: object, propertyName: string) {
    return registerDecorator({
      name: 'isFileArray',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!Array.isArray(value)) {
            return false;
          }
          for (const file of value) {
            if (options?.mimeType) {
              for (const mimeType of options.mimeType) {
                const re = new RegExp(`^${mimeType?.replace('*', '.*')}$`, 'g');
                if (!re.test(file?.mimeType)) {
                  return false;
                }
              }
            }
          }
          return true;
        },
      },
    });
  };
}

export function IsNullable(validationOptions?: ValidationOptions) {
  return ValidateIf(
    (_object, value) => ![null, undefined].includes(value),
    validationOptions,
  );
}

export function IsEmptyable(validationOptions?: ValidationOptions) {
  return ValidateIf(
    (_object, value) => ![null, undefined].includes(value),
    validationOptions,
  );
}
