import { Request, Response, NextFunction } from "express";
import { ApiError } from "../core";

/**
 * Middleware factory to authorize users based on their role for a specific business.
 * It reads the user's roles from the JWT payload attached to `req.user`.
 *
 * @param allowedRoles - An array of role names (e.g., ["OWNER", "COLLABORATOR"]) that are allowed to access the route.
 * @returns An Express middleware function.
 */
export const authorizeRoles = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    // The ID of the business being accessed, typically from URL parameters or the request body
    const businessIdStr = req.params.id || req.body.idBusiness || req.body.id;

    if (!user) {
      return next(
        new ApiError(
          401,
          "Authentication failed: User information not found in token.",
        ),
      );
    }

    if (!businessIdStr) {
      return next(
        new ApiError(
          400,
          "Bad Request: A Business ID must be provided to check permissions.",
        ),
      );
    }

    const businessId = parseInt(businessIdStr, 10);
    if (isNaN(businessId)) {
      return next(
        new ApiError(
          400,
          "Bad Request: The provided Business ID is not a valid number.",
        ),
      );
    }

    const collaboratorDetails = user.collaboratorDetails;

    if (!collaboratorDetails || !Array.isArray(collaboratorDetails)) {
      return next(
        new ApiError(
          403,
          "Access Denied: You are not associated with any business.",
        ),
      );
    }

    // Find the user's role specifically for the business they are trying to access
    const businessAssociation = collaboratorDetails.find(
      (detail) => detail.businessId === businessId,
    );

    if (!businessAssociation) {
      return next(
        new ApiError(
          403,
          "Access Denied: You are not associated with this specific business.",
        ),
      );
    }

    const userRoleForBusiness = businessAssociation.role;

    // Check if the user's role is in the list of roles allowed for this route
    if (allowedRoles.includes(userRoleForBusiness)) {
      // Success! The user has the required role for this business.
      return next();
    } else {
      // The user is associated with the business, but their role is not authorized for this action.
      return next(
        new ApiError(
          403,
          `Access Denied: Your role ('${userRoleForBusiness}') is not authorized to perform this action.`,
        ),
      );
    }
  };
};
