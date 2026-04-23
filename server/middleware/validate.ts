import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";

type ValidationSchemas = {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
};

export const validate =
  (schemas: ValidationSchemas) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.params)
        req.params = schemas.params.parse(req.params) as typeof req.params;
      if (schemas.query)
        req.query = schemas.query.parse(req.query) as typeof req.query;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.issues,
        });
      }

      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  };
