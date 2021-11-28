exports.responseCodes = {
  success: 200,
  new_resource_created: 201,
  bad_request: 400,
  unauthorized: 401,
  forbidden: 403,
  not_found: 404,
  already_exist: 409,
  internal_server_error: 500,
  unable_to_process: 422,
};
exports.commonResponse = {
  endpoint_not_found: "Endpoint not found",
  internal_server_error_msg: "Internal server error",
};
exports.userConstantMsg = {
  auth: {
    invalid_password: "Invalid password",
    invalid_email: "Invalid email",
    invalid_password_length: "Password is too shot",
    user_not_exist: "User not exist",
    user_updated_suceess: "User updated successfully",
    user_password_update_suceess: "User password updated successfully",
    profile_image_success: "Profile image updated successfully",
    profile_image_invalid: "Profile image is invalid",
    email_exists: "Email exists",
    dulicate_email: "duplicate email found",
  },
};
