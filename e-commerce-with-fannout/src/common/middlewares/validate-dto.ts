import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { Request, Response, NextFunction } from "express";

export function validateDto(DtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(DtoClass, req.body);
    const errors = await validate(dtoInstance, {
      whitelist: true,
      forbidUnknownValues: true,
    });

    if (errors.length > 0) {
      const formattedErrors = flattenValidationErrors(errors);
      res.status(400).json({ errors: formattedErrors });
      return;
    }

    next();
  };
}

function flattenValidationErrors(errors: ValidationError[]): {
  field: string;
  messages: unknown;
}[] {
  return errors.flatMap((err) => {
    if (err.children && err.children.length > 0) {
      return flattenValidationErrors(err.children);
    }

    return {
      field: err.property,
      messages: Object.values(err.constraints || {}),
    };
  });
}
