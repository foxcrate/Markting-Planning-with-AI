import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'keyValueFlow', async: false })
export class keyValueFlowValidator implements ValidatorConstraintInterface {
  validate(columnValue: string, args: ValidationArguments) {
    if (!this.keyValueFlowValidation(columnValue)) {
      return false;
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Flow format is not valid';
  }

  keyValueFlowValidation(obj) {
    const keyRegex = /^[1-9]$|^10$/;
    const valueCriteria = {
      name: (val) => typeof val === 'string',
      prompt: (val) => typeof val === 'string',
    };

    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) continue;

      if (!keyRegex.test(key)) {
        // console.log(`Invalid key: ${key}`);
        return false;
      }

      const value = obj[key];
      for (const prop in valueCriteria) {
        if (!value.hasOwnProperty(prop)) {
          // console.log(`Missing property '${prop}' in value of key '${key}'`);
          return false;
        }
        if (!valueCriteria[prop](value[prop])) {
          // console.log(
          //   `Invalid value '${value[prop]}' for property '${prop}' in key '${key}'`,
          // );
          return false;
        }
      }
    }

    if (!this.validateKeySequence(obj)) {
      return false;
    }

    return true;
  }

  validateKeySequence(obj): boolean {
    const keys = Object.keys(obj)
      .map(Number)
      .sort((a, b) => a - b);
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] !== i + 1) {
        return false;
      }
    }
    return true;
  }
}
