import logging
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)

    # Now add the HTTP status code to the response.
    if response is not None:
        response.data['status_code'] = response.status_code
        # Flatten simple detail errors if they are dicts or lists
        if 'detail' in response.data:
            response.data['error'] = response.data.pop('detail')
        else:
            response.data['error'] = "Validation error occurred"
            response.data['details'] = response.data.copy()
    else:
        # If response is None, it's a server-level unhandled exception (e.g. database failure)
        logger.error(f"Unhandled Exception: {str(exc)}", exc_info=True)
        
        # Provide a safe, unified JSON response to protect details
        response = Response(
            {
                "error": "A severe internal server error occurred. Please contact the administrator.",
                "status_code": 500
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return response
