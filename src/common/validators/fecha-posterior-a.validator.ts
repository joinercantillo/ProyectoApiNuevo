import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'fechaPosteriorA', async: false })
class FechaPosteriorAConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments): boolean {
    if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) {
      return true;
    }

    const relatedValue = (args.object as Record<string, unknown>)[
      args.constraints[0] as string
    ];
    if (
      typeof relatedValue !== 'string' ||
      Number.isNaN(Date.parse(relatedValue))
    ) {
      return true;
    }

    return Date.parse(value) >= Date.parse(relatedValue);
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} debe ser igual o posterior a ${args.constraints[0] as string}`;
  }
}

export function FechaPosteriorA(
  property: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object: object, propertyName: string | symbol) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions,
      constraints: [property],
      validator: FechaPosteriorAConstraint,
    });
  };
}
