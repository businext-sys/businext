/**
 * ARCHIVO GENERADO AUTOMATICAMENTE — NO EDITAR A MANO.
 *
 * Generado desde el OpenAPI schema de businext-backend via
 * `pnpm generate:types` (packages/shared-core/scripts/generate-types.mjs).
 * Ver issue #018 y .github/workflows/generate-types.yml.
 */
export interface paths {
    "/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Health */
        get: operations["health_health_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/signup": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Signup Owner Endpoint */
        post: operations["signup_owner_endpoint_auth_signup_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Access Context
         * @description Returns the full access context for the authenticated user.
         *
         *     The frontend should consume this endpoint to determine what the user can
         *     do, instead of querying role/subscription/status from Supabase directly.
         *
         *     HTTP status codes carry the authorization signal:
         *     - 200: authenticated and context resolved
         *     - 401: missing/invalid/expired token
         *     - 403: valid token but access denied (e.g., incomplete onboarding)
         */
        get: operations["get_access_context_auth_me_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/employees/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Employees */
        get: operations["get_employees_employees__get"];
        put?: never;
        /** Create Employee Invite */
        post: operations["create_employee_invite_employees__post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/employees/{member_user_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Remove Employee */
        delete: operations["remove_employee_employees__member_user_id__delete"];
        options?: never;
        head?: never;
        /** Patch Employee */
        patch: operations["patch_employee_employees__member_user_id__patch"];
        trace?: never;
    };
    "/employees/onboarding/complete": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Complete Onboarding */
        post: operations["complete_onboarding_employees_onboarding_complete_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/reservations/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Reservations
         * @description Return PENDING reservations from the last 7 days onward + COMPLETED and NO_SHOW from today.
         */
        get: operations["get_reservations_reservations__get"];
        put?: never;
        /** Create Reservation */
        post: operations["create_reservation_reservations__post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/reservations/{reservation_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Reservation By Id */
        get: operations["get_reservation_by_id_reservations__reservation_id__get"];
        put?: never;
        post?: never;
        /** Delete Reservation */
        delete: operations["delete_reservation_reservations__reservation_id__delete"];
        options?: never;
        head?: never;
        /** Update Reservation */
        patch: operations["update_reservation_reservations__reservation_id__patch"];
        trace?: never;
    };
    "/reservations/{reservation_id}/revert": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Revert Reservation
         * @description Revert a COMPLETED or NO_SHOW reservation back to PENDING and delete its linked finance.
         */
        post: operations["revert_reservation_reservations__reservation_id__revert_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/configuration/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Configuration */
        get: operations["get_configuration_configuration__get"];
        put?: never;
        /** Create Configuration */
        post: operations["create_configuration_configuration__post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/configuration/reminders": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Reminders Setting */
        get: operations["get_reminders_setting_configuration_reminders_get"];
        /** Update Reminders Setting */
        put: operations["update_reminders_setting_configuration_reminders_put"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/configuration/{configuration_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Delete Configuration */
        delete: operations["delete_configuration_configuration__configuration_id__delete"];
        options?: never;
        head?: never;
        /** Update Configuration */
        patch: operations["update_configuration_configuration__configuration_id__patch"];
        trace?: never;
    };
    "/products/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Products */
        get: operations["get_products_products__get"];
        put?: never;
        /** Create Product */
        post: operations["create_product_products__post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/products/{product_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Product By Id */
        get: operations["get_product_by_id_products__product_id__get"];
        put?: never;
        post?: never;
        /** Delete Product */
        delete: operations["delete_product_products__product_id__delete"];
        options?: never;
        head?: never;
        /** Update Product */
        patch: operations["update_product_products__product_id__patch"];
        trace?: never;
    };
    "/finances/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Finances */
        get: operations["get_finances_finances__get"];
        put?: never;
        /** Create Finances */
        post: operations["create_finances_finances__post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/finances/{finances_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Finances By Id */
        get: operations["get_finances_by_id_finances__finances_id__get"];
        put?: never;
        post?: never;
        /** Delete Finances */
        delete: operations["delete_finances_finances__finances_id__delete"];
        options?: never;
        head?: never;
        /** Update Finances */
        patch: operations["update_finances_finances__finances_id__patch"];
        trace?: never;
    };
    "/finances/annual_finances/{year}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Annual Finances */
        get: operations["get_annual_finances_finances_annual_finances__year__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/google-reviews/profile": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Profile
         * @description Get the current business's Google profile.
         */
        get: operations["get_profile_google_reviews_profile_get"];
        put?: never;
        /**
         * Create Profile
         * @description Submit a Google Maps URL to create a business profile.
         */
        post: operations["create_profile_google_reviews_profile_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/google-reviews/sync": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Sync Reviews
         * @description Trigger incremental review sync from Outscraper.
         */
        post: operations["sync_reviews_google_reviews_sync_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/google-reviews/reviews": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Reviews
         * @description Get paginated reviews for the business.
         */
        get: operations["get_reviews_google_reviews_reviews_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/google-reviews/reviews/{review_db_id}/generate-response": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Generate Response For Review
         * @description Generate an AI response for a specific review.
         */
        post: operations["generate_response_for_review_google_reviews_reviews__review_db_id__generate_response_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/google-reviews/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Generate Summary
         * @description Generate or refresh the AI business summary.
         */
        post: operations["generate_summary_google_reviews_summary_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/working-hours/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Working Hours
         * @description Get working hours. If member_user_id is provided, returns that member's hours.
         *     Otherwise returns business-wide (general) hours.
         */
        get: operations["get_working_hours_working_hours__get"];
        /**
         * Upsert Working Hours
         * @description Replace all working hour blocks for business-wide or a specific member.
         *     Supports multiple blocks per day.
         */
        put: operations["upsert_working_hours_working_hours__put"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/intelligence/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Summary
         * @description Return the most recent weekly summary for this business.
         */
        get: operations["get_summary_intelligence_summary_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/intelligence/summary/generate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Generate Summary
         * @description Generate the weekly summary for the previous week.
         */
        post: operations["generate_summary_intelligence_summary_generate_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/public/book/{business_id}/locations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Locations
         * @description Returns active locations for a business.
         */
        get: operations["get_locations_public_book__business_id__locations_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/public/book/{business_id}/services": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Services
         * @description Returns available services and employees for a business, optionally filtered by location.
         */
        get: operations["get_services_public_book__business_id__services_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/public/book/{business_id}/availability": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Availability
         * @description Start times where the service (30 min without `service`) fits, for a date and optional employee.
         */
        get: operations["get_availability_public_book__business_id__availability_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/public/book/{business_id}/request": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create Booking Request
         * @description Creates a new booking request.
         */
        post: operations["create_booking_request_public_book__business_id__request_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/booking-requests/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Booking Requests
         * @description List booking requests for this business.
         */
        get: operations["list_booking_requests_booking_requests__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/booking-requests/{request_id}/accept": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Accept Booking Request
         * @description Accept a booking request → creates a Reservation.
         */
        post: operations["accept_booking_request_booking_requests__request_id__accept_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/booking-requests/{request_id}/reject": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Reject Booking Request
         * @description Reject a booking request.
         */
        post: operations["reject_booking_request_booking_requests__request_id__reject_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/locations/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Locations
         * @description List all locations for the business.
         */
        get: operations["list_locations_locations__get"];
        put?: never;
        /**
         * Create Location
         * @description Create a new location for the business.
         */
        post: operations["create_location_locations__post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/locations/{location_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Delete Location
         * @description Delete a location. Prevents deleting the last active location.
         */
        delete: operations["delete_location_locations__location_id__delete"];
        options?: never;
        head?: never;
        /**
         * Update Location
         * @description Update an existing location.
         */
        patch: operations["update_location_locations__location_id__patch"];
        trace?: never;
    };
    "/users/{user_id}/push-tokens": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Register Push Token
         * @description Registra (o reasigna) un Expo push token para un usuario.
         *
         *     No requiere suscripcion activa (a diferencia de la mayoria de
         *     endpoints) porque registrar el token del dispositivo debe funcionar
         *     incluso si la suscripcion del owner esta vencida — es la propia app
         *     quien decide que UI mostrar segun `capabilities.can_access_app`.
         *
         *     Solo el propio usuario puede registrar su token (`user_id` del path
         *     debe coincidir con el del JWT).
         */
        post: operations["register_push_token_users__user_id__push_tokens_post"];
        /**
         * Unregister Push Token
         * @description Elimina un push token (ej. al hacer logout en el dispositivo).
         */
        delete: operations["unregister_push_token_users__user_id__push_tokens_delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notification-preferences/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Notification Preferences
         * @description Preferencias del usuario; sin fila, todo activado (15 min antes, resumen a las 9).
         */
        get: operations["get_notification_preferences_notification_preferences__get"];
        /** Update Notification Preferences */
        put: operations["update_notification_preferences_notification_preferences__put"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/assistant/chat": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Chat
         * @description Un turno del chat, respondido en streaming SSE (eventos del contrato de shared-core).
         */
        post: operations["chat_assistant_chat_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/assistant/actions/{action_id}/confirm": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Confirm Action
         * @description Ejecuta (o descarta) una accion propuesta por el asistente. Responde en SSE.
         */
        post: operations["confirm_action_assistant_actions__action_id__confirm_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/assistant/usage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Usage
         * @description Coste diario del asistente para el negocio (solo owner), el dia mas reciente primero.
         */
        get: operations["get_usage_assistant_usage_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/assistant/conversations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Conversations
         * @description Conversaciones del usuario, la mas reciente primero (`ConversationSummary` de shared-core).
         */
        get: operations["list_conversations_assistant_conversations_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/assistant/conversations/{conversation_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Conversation
         * @description Una conversacion con sus mensajes y bloques (`Conversation` de shared-core).
         */
        get: operations["get_conversation_assistant_conversations__conversation_id__get"];
        put?: never;
        post?: never;
        /** Delete Conversation */
        delete: operations["delete_conversation_assistant_conversations__conversation_id__delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/trends/preferences": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Content Preferences
         * @description Preferencias de contenido del negocio (sin fila: los valores por defecto, desactivado).
         */
        get: operations["get_content_preferences_trends_preferences_get"];
        /**
         * Update Content Preferences
         * @description Guarda las preferencias de contenido completas del negocio.
         */
        put: operations["update_content_preferences_trends_preferences_put"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/trends/insight": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Insight
         * @description Ultimo analisis de tendencias del negocio, con las tendencias que usa.
         */
        get: operations["get_insight_trends_insight_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/trends/insight/refresh": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Refresh Insight
         * @description Regenera el analisis de hoy y sus sugerencias pendientes. Una vez al dia.
         *     Sin tendencias de hoy devuelve el ultimo analisis tal cual, sin gastar el refresco.
         */
        post: operations["refresh_insight_trends_insight_refresh_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/trends/suggestions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Suggestions
         * @description Sugerencias de contenido del negocio, por hora de publicacion.
         */
        get: operations["list_suggestions_trends_suggestions_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/trends/suggestions/{suggestion_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update Suggestion
         * @description Marca una sugerencia como abierta, descartada o publicada.
         */
        patch: operations["update_suggestion_trends_suggestions__suggestion_id__patch"];
        trace?: never;
    };
    "/internal/trends/ingest": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Ingest
         * @description Guarda las tendencias del dia; relanzarlo el mismo dia no repite consultas ni filas.
         */
        post: operations["ingest_internal_trends_ingest_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/internal/trends/analyze": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Analyze
         * @description Analiza los negocios activados con tendencias de hoy; relanzarlo no repite analisis.
         */
        post: operations["analyze_internal_trends_analyze_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/internal/trends/dispatch": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Dispatch
         * @description Envia los avisos de las sugerencias que tocan; relanzarlo no reenvia ninguno.
         */
        post: operations["dispatch_internal_trends_dispatch_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/internal/reminders/run": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Run
         * @description Envia los recordatorios de las citas de mañana; relanzarlo no reenvia ninguno.
         */
        post: operations["run_internal_reminders_run_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/voice-agent/config": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Voice Agent Config
         * @description Configuracion del agente de voz del negocio y sus numeros (sin fila: desactivado, modo solicitud).
         */
        get: operations["get_voice_agent_config_voice_agent_config_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update Voice Agent Config
         * @description Activa o desactiva el agente y cambia su modo de reserva (`request` o `confirm`).
         */
        patch: operations["update_voice_agent_config_voice_agent_config_patch"];
        trace?: never;
    };
    "/voice-agent/calls": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Voice Calls
         * @description Llamadas del negocio, de la mas reciente a la mas antigua (sin transcripcion).
         */
        get: operations["list_voice_calls_voice_agent_calls_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/voice-agent/calls/{call_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Voice Call
         * @description Una llamada con su transcripcion y grabacion; 404 si no es del negocio.
         */
        get: operations["get_voice_call_voice_agent_calls__call_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/voice-agent/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Voice Call Stats
         * @description KPIs de las llamadas de los ultimos `days` dias (hoy incluido, hora de Madrid).
         */
        get: operations["get_voice_call_stats_voice_agent_stats_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/retell/inbound": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Inbound Call
         * @description Resuelve el numero marcado a su negocio; rechaza si no hay negocio o el agente esta desactivado.
         */
        post: operations["inbound_call_retell_inbound_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/retell/webhook": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Call Event
         * @description Guarda el estado de la llamada en `voicecall`. El negocio sale del numero
         *     marcado; sin numero (llamada web de prueba), del `business_id` que fijo el
         *     webhook de entrada.
         */
        post: operations["call_event_retell_webhook_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/retell/functions/{function_name}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Run Function
         * @description Ejecuta una funcion del agente para el negocio de la llamada. Los errores
         *     de negocio responden 200 con `ok: false` y el motivo, para que el agente se
         *     lo diga al cliente; un fallo de Retell (no 2xx) solo le diria que algo fallo.
         */
        post: operations["run_function_retell_functions__function_name__post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/customer-messages/draft": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Customer Message Draft
         * @description Texto propuesto para escribir a un cliente del negocio.
         */
        get: operations["get_customer_message_draft_customer_messages_draft_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/customer-messages/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Send Customer Message
         * @description Envía el email al cliente y lo registra; como mucho uno cada 7 días por cliente.
         */
        post: operations["send_customer_message_customer_messages__post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/customers/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Find Customers
         * @description Clientes de las reservas del negocio cuyo nombre, email o teléfono contiene `q`; el más reciente primero.
         */
        get: operations["find_customers_customers__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/customers/detail": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Customer Detail
         * @description Ficha del cliente con ese nombre (sin mayúsculas ni espacios de más): visitas, «no vino», gasto y reservas.
         */
        get: operations["get_customer_detail_customers_detail_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Delete My Account
         * @description Borra la cuenta del usuario autenticado.
         *
         *     No requiere suscripcion activa: un owner con la suscripcion vencida
         *     tambien tiene que poder borrar su cuenta. Es idempotente; si responde
         *     502 tras borrar los datos, la app puede reintentar.
         */
        delete: operations["delete_my_account_users_me_delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/loyalty/program": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Program
         * @description Regla de la tarjeta; sin configurar, desactivada con 10 sellos → «Corte gratis».
         */
        get: operations["get_program_loyalty_program_get"];
        /**
         * Update Program
         * @description Activa la tarjeta y fija la regla y los colores. Los pases ya emitidos se actualizan.
         */
        put: operations["update_program_loyalty_program_put"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/loyalty/cards": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Card
         * @description Tarjeta del cliente por email o, en su defecto, por nombre (el email de sus reservas).
         */
        get: operations["get_card_loyalty_cards_get"];
        put?: never;
        /**
         * Create Card
         * @description Crea (o devuelve) la tarjeta de un cliente, p. ej. para enseñarle el enlace del pase en el local.
         */
        post: operations["create_card_loyalty_cards_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/loyalty/cards/{serial_number}/redeem": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Redeem Card
         * @description Entrega el premio: gasta los sellos más antiguos que pide la regla.
         */
        post: operations["redeem_card_loyalty_cards__serial_number__redeem_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/loyalty/cards/{serial_number}/send-pass": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Send Pass
         * @description (Re)envía al email del cliente el enlace «Añadir a Apple Wallet». El enlace solo
         *     sale por email: así se demuestra que el email es suyo. Devuelve también el
         *     enlace para enseñarlo en el local (el barbero ya ve la tarjeta).
         */
        post: operations["send_pass_loyalty_cards__serial_number__send_pass_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/loyalty/scan/{token}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Scan Card
         * @description Tarjeta del QR del pase: cliente, sellos, si tiene el premio, últimas visitas y si ya se selló hoy.
         */
        get: operations["scan_card_loyalty_scan__token__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/loyalty/scan/{token}/stamp": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Stamp Scanned Card
         * @description Sello manual para un walk-in (visita sin reserva). Idempotente por día: si la
         *     tarjeta ya tiene un sello de hoy (manual o de reserva), no suma y
         *     `stamp_added` es false.
         */
        post: operations["stamp_scanned_card_loyalty_scan__token__stamp_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/loyalty/program/logo": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Upload Program Logo
         * @description Sube el logo del negocio para el pase (PNG, JPG o WebP, hasta 2 MB). Se adapta a los tamaños de Apple.
         */
        put: operations["upload_program_logo_loyalty_program_logo_put"];
        post?: never;
        /**
         * Delete Program Logo
         * @description Quita el logo propio: los pases vuelven a llevar el de Businext.
         */
        delete: operations["delete_program_logo_loyalty_program_logo_delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/public/loyalty/{business_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Public Program
         * @description Para la página de reservas: si mostrar la tarjeta y el botón «Añadir a Apple Wallet».
         */
        get: operations["get_public_program_public_loyalty__business_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/public/loyalty/passes/{serial_number}.pkpass": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Download Pass
         * @description Descarga del pase con el enlace que se da al cliente (serial + token del pase).
         */
        get: operations["download_pass_public_loyalty_passes__serial_number__pkpass_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/wallet/apple/v1/devices/{device_id}/registrations/{pass_type_id}/{serial_number}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Register Device
         * @description 201 si el dispositivo se registra para este pase; 200 si ya lo estaba (se actualiza el push token).
         */
        post: operations["register_device_wallet_apple_v1_devices__device_id__registrations__pass_type_id___serial_number__post"];
        /** Unregister Device */
        delete: operations["unregister_device_wallet_apple_v1_devices__device_id__registrations__pass_type_id___serial_number__delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/wallet/apple/v1/devices/{device_id}/registrations/{pass_type_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Updated Serials
         * @description Seriales de los pases de este dispositivo cambiados desde la marca; 204 si ninguno.
         */
        get: operations["updated_serials_wallet_apple_v1_devices__device_id__registrations__pass_type_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/wallet/apple/v1/passes/{pass_type_id}/{serial_number}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Latest Pass
         * @description El `.pkpass` actual; 304 si no ha cambiado desde `If-Modified-Since`.
         */
        get: operations["latest_pass_wallet_apple_v1_passes__pass_type_id___serial_number__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/wallet/apple/v1/log": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Wallet Log
         * @description Errores que Wallet reporta del web service (p. ej. un pase mal firmado).
         */
        post: operations["wallet_log_wallet_apple_v1_log_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** Body_upload_program_logo_loyalty_program_logo_put */
        Body_upload_program_logo_loyalty_program_logo_put: {
            /**
             * File
             * Format: binary
             */
            file: string;
        };
        /** BookingRequestCreate */
        BookingRequestCreate: {
            /** Client Name */
            client_name: string;
            /** Client Email */
            client_email: string;
            /** Client Phone */
            client_phone: string;
            /** Employee Name */
            employee_name?: string | null;
            /** Service */
            service: string;
            /**
             * Requested Date
             * Format: date-time
             */
            requested_date: string;
            /** Location Id */
            location_id?: number | null;
        };
        /** BookingRequestPublic */
        BookingRequestPublic: {
            /** Client Name */
            client_name: string;
            /** Client Email */
            client_email: string;
            /** Client Phone */
            client_phone: string;
            /** Employee Name */
            employee_name?: string | null;
            /** Service */
            service: string;
            /**
             * Requested Date
             * Format: date-time
             */
            requested_date: string;
            /** Proposed Date */
            proposed_date?: string | null;
            /**
             * Status
             * @default REQUESTED
             */
            status: string;
            /** Id */
            id: number;
            /** Business Id */
            business_id: string;
            /** Location Id */
            location_id?: number | null;
            /** Responded At */
            responded_at?: string | null;
            /**
             * Expires At
             * Format: date-time
             */
            expires_at: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
        };
        /** BusinessConfigurationBase */
        BusinessConfigurationBase: {
            /** Business Name */
            business_name: string;
            /** Business Phone */
            business_phone?: string | null;
            /** Business Email */
            business_email?: string | null;
            /** Commission Product */
            commission_product?: number | null;
            /** Commission Service */
            commission_service?: number | null;
        };
        /** BusinessConfigurationPublic */
        BusinessConfigurationPublic: {
            /** Business Name */
            business_name: string;
            /** Business Phone */
            business_phone?: string | null;
            /** Business Email */
            business_email?: string | null;
            /** Commission Product */
            commission_product?: number | null;
            /** Commission Service */
            commission_service?: number | null;
            /** Id */
            id: number;
        };
        /** BusinessConfigurationUpdate */
        BusinessConfigurationUpdate: {
            /** Business Name */
            business_name?: string | null;
            /** Business Phone */
            business_phone?: string | null;
            /** Business Email */
            business_email?: string | null;
            /** Commission Product */
            commission_product?: number | null;
            /** Commission Service */
            commission_service?: number | null;
        };
        /** CallAnalysis */
        CallAnalysis: {
            /** Call Summary */
            call_summary?: string | null;
            /** User Sentiment */
            user_sentiment?: string | null;
            /** Call Successful */
            call_successful?: boolean | null;
        };
        /** CallEvent */
        CallEvent: {
            /** Event */
            event: string;
            call: components["schemas"]["CallEventCall"];
        };
        /** CallEventCall */
        CallEventCall: {
            /** Call Id */
            call_id: string;
            /** From Number */
            from_number?: string | null;
            /** To Number */
            to_number?: string | null;
            /** Start Timestamp */
            start_timestamp?: number | null;
            /** End Timestamp */
            end_timestamp?: number | null;
            /** Duration Ms */
            duration_ms?: number | null;
            /** Disconnection Reason */
            disconnection_reason?: string | null;
            /** Transcript */
            transcript?: string | null;
            /** Recording Url */
            recording_url?: string | null;
            /** Metadata */
            metadata?: {
                [key: string]: unknown;
            };
            /** Retell Llm Dynamic Variables */
            retell_llm_dynamic_variables?: {
                [key: string]: unknown;
            };
            call_analysis?: components["schemas"]["CallAnalysis"] | null;
        };
        /** CallInbound */
        CallInbound: {
            /** Call Id */
            call_id?: string | null;
            /** From Number */
            from_number?: string | null;
            /** To Number */
            to_number?: string | null;
        };
        /** ChatRequest */
        ChatRequest: {
            /** Conversation Id */
            conversation_id?: string | null;
            /** Message */
            message: string;
        };
        /** CompleteEmployeeOnboardingInput */
        CompleteEmployeeOnboardingInput: {
            /** Password */
            password: string;
        };
        /** ConfirmActionRequest */
        ConfirmActionRequest: {
            /** Conversation Id */
            conversation_id: string;
            /**
             * Decision
             * @enum {string}
             */
            decision: "confirm" | "cancel";
        };
        /** ContentPreferencesPublic */
        ContentPreferencesPublic: {
            /** Enabled */
            enabled: boolean;
            /** Networks */
            networks: ("instagram" | "tiktok")[];
            /** Max Per Day */
            max_per_day: number;
            /**
             * Quiet From
             * Format: time
             */
            quiet_from: string;
            /**
             * Quiet To
             * Format: time
             */
            quiet_to: string;
            /** Timezone */
            timezone: string;
            /** Niche */
            niche: string;
            /** Language */
            language: string;
            /** Country */
            country: string;
        };
        /** ContentSuggestionPublic */
        ContentSuggestionPublic: {
            /** Id */
            id: number;
            /**
             * Network
             * @enum {string}
             */
            network: "instagram" | "tiktok";
            /**
             * Format
             * @enum {string}
             */
            format: "reel" | "short" | "carrusel" | "story";
            /** Idea */
            idea: string;
            /** Script */
            script: string[];
            /** Caption Hint */
            caption_hint: string;
            /** Audio Hint */
            audio_hint: string | null;
            /**
             * Publish At
             * Format: date-time
             */
            publish_at: string;
            /** Source Trend Ids */
            source_trend_ids: string[];
            /**
             * Status
             * @enum {string}
             */
            status: "pending" | "sent" | "opened" | "dismissed" | "published";
            /** Sent At */
            sent_at: string | null;
        };
        /** ContentSuggestionStatusUpdate */
        ContentSuggestionStatusUpdate: {
            /**
             * Status
             * @enum {string}
             */
            status: "opened" | "dismissed" | "published";
        };
        /** CustomerDetail */
        CustomerDetail: {
            /** Name */
            name: string;
            /** Phone */
            phone: string | null;
            /** Email */
            email: string | null;
            /** Last Visit */
            last_visit: string | null;
            /** Visits */
            visits: number;
            /** No Shows */
            no_shows: number;
            /** Total Spent */
            total_spent: number;
            next_reservation: components["schemas"]["CustomerReservation"] | null;
            /** Reservations */
            reservations: components["schemas"]["CustomerReservation"][];
        };
        /** CustomerMessageCreate */
        CustomerMessageCreate: {
            /**
             * Customer Email
             * Format: email
             */
            customer_email: string;
            /** Message */
            message: string;
        };
        /** CustomerMessageDraft */
        CustomerMessageDraft: {
            /** Customer Email */
            customer_email: string;
            /** Customer Name */
            customer_name: string;
            /** Message */
            message: string;
        };
        /** CustomerMessagePublic */
        CustomerMessagePublic: {
            /** Id */
            id: number;
            /** Customer Email */
            customer_email: string;
            /** Message */
            message: string;
            /** Sent By */
            sent_by: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
        };
        /** CustomerPublic */
        CustomerPublic: {
            /** Name */
            name: string;
            /** Phone */
            phone: string | null;
            /** Email */
            email: string | null;
            /** Last Visit */
            last_visit: string | null;
        };
        /** CustomerReservation */
        CustomerReservation: {
            /** Id */
            id: number;
            /**
             * Start
             * Format: date-time
             */
            start: string;
            /** Service */
            service: string;
            /** In Charge */
            in_charge: string | null;
            /** Status */
            status: string;
        };
        /** EmployeePublic */
        EmployeePublic: {
            /** Id */
            id?: number | null;
            /** Businessid */
            businessId: string;
            /** Memberuserid */
            memberUserId: string;
            /** Displayname */
            displayName?: string | null;
            /** Email */
            email?: string | null;
            /** Phone */
            phone?: string | null;
            /** Role */
            role: string;
            /** Status */
            status: string;
            /** Locationid */
            locationId?: number | null;
            /** Createdat */
            createdAt?: string | null;
        };
        /** FinancesBase */
        FinancesBase: {
            /** Concept */
            concept: string;
            /** Amount */
            amount: number;
            /** Type */
            type: string;
            /** Creator */
            creator: string;
            /** Reservation Id */
            reservation_id?: number | null;
            /** Customer Name */
            customer_name?: string | null;
            /** Product Id */
            product_id?: number | null;
        };
        /** FinancesPublic */
        FinancesPublic: {
            /** Concept */
            concept: string;
            /** Amount */
            amount: number;
            /** Type */
            type: string;
            /** Creator */
            creator: string;
            /** Reservation Id */
            reservation_id: number | null;
            /** Customer Name */
            customer_name?: string | null;
            /** Product Id */
            product_id?: number | null;
            /** Id */
            id: number;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Commission Rate
             * @default 0
             */
            commission_rate: number | null;
            /**
             * Commission Amount
             * @default 0
             */
            commission_amount: number | null;
        };
        /** FinancesUpdate */
        FinancesUpdate: {
            /** Concept */
            concept?: string | null;
            /** Amount */
            amount?: number | null;
            /** Type */
            type?: string | null;
            /** Creator */
            creator?: string | null;
            /** Reservation Id */
            reservation_id?: number | null;
            /** Customer Name */
            customer_name?: string | null;
            /** Product Id */
            product_id?: number | null;
        };
        /** FunctionCall */
        FunctionCall: {
            /** Name */
            name?: string | null;
            call: components["schemas"]["RetellCall"];
            /** Args */
            args?: {
                [key: string]: unknown;
            };
        };
        /** GenerateResponseResult */
        GenerateResponseResult: {
            /** Review Id */
            review_id: number;
            /** Ai Generated Response */
            ai_generated_response: string;
            /** Ai Response Generated At */
            ai_response_generated_at: string;
        };
        /** GoogleBusinessProfilePublic */
        GoogleBusinessProfilePublic: {
            /** Source Url */
            source_url: string;
            /** Google Id */
            google_id: string;
            /** Id */
            id: number;
            /** Name */
            name?: string | null;
            /** Address */
            address?: string | null;
            /** Category */
            category?: string | null;
            /** Phone */
            phone?: string | null;
            /** Rating */
            rating?: number | null;
            /**
             * Total Reviews
             * @default 0
             */
            total_reviews: number;
            /** Reviews Per Score */
            reviews_per_score?: string | null;
            /** Location Link */
            location_link?: string | null;
            /**
             * Validation Status
             * @default pending
             */
            validation_status: string;
            /** Validated By */
            validated_by?: string | null;
            /** Validated At */
            validated_at?: string | null;
            /** Last Sync At */
            last_sync_at?: string | null;
            /**
             * Last Review Timestamp
             * @default 0
             */
            last_review_timestamp: number;
            /** Ai Summary */
            ai_summary?: string | null;
            /** Ai Summary Generated At */
            ai_summary_generated_at?: string | null;
            /**
             * Created At
             * Format: date-time
             */
            created_at?: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at?: string;
        };
        /** GoogleReviewPublic */
        GoogleReviewPublic: {
            /** Review Id */
            review_id: string;
            /** Author Title */
            author_title?: string | null;
            /** Author Image */
            author_image?: string | null;
            /** Review Text */
            review_text?: string | null;
            /** Review Rating */
            review_rating: number;
            /** Review Timestamp */
            review_timestamp: number;
            /** Review Datetime Utc */
            review_datetime_utc?: string | null;
            /** Review Link */
            review_link?: string | null;
            /** Owner Answer */
            owner_answer?: string | null;
            /** Owner Answer Timestamp */
            owner_answer_timestamp?: number | null;
            /** Id */
            id: number;
            /** Profile Id */
            profile_id: number;
            /** Ai Generated Response */
            ai_generated_response?: string | null;
            /** Ai Response Generated At */
            ai_response_generated_at?: string | null;
            /**
             * Created At
             * Format: date-time
             */
            created_at?: string;
        };
        /** HTTPValidationError */
        HTTPValidationError: {
            /** Detail */
            detail?: components["schemas"]["ValidationError"][];
        };
        /** InboundWebhook */
        InboundWebhook: {
            /** Event */
            event: string;
            call_inbound?: components["schemas"]["CallInbound"] | null;
        };
        /** InviteEmployeeInput */
        InviteEmployeeInput: {
            /** Displayname */
            displayName: string;
            /** Email */
            email: string;
            /** Phone */
            phone: string;
            /**
             * Role
             * @default employee
             */
            role: string;
        };
        /** InviteEmployeeResponse */
        InviteEmployeeResponse: {
            /** Success */
            success: boolean;
            /** Employees */
            employees: components["schemas"]["EmployeePublic"][];
        };
        /** LocationCreate */
        LocationCreate: {
            /** Name */
            name: string;
            /** Address */
            address?: string | null;
            /** Phone */
            phone?: string | null;
            /** Maps Link */
            maps_link?: string | null;
            /** Latitude */
            latitude?: number | null;
            /** Longitude */
            longitude?: number | null;
        };
        /** LocationPublic */
        LocationPublic: {
            /** Name */
            name: string;
            /** Address */
            address?: string | null;
            /** Phone */
            phone?: string | null;
            /** Maps Link */
            maps_link?: string | null;
            /** Latitude */
            latitude?: number | null;
            /** Longitude */
            longitude?: number | null;
            /** Id */
            id: number;
            /** Business Id */
            business_id: string;
            /** Is Active */
            is_active: boolean;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
        };
        /** LocationUpdate */
        LocationUpdate: {
            /** Name */
            name?: string | null;
            /** Address */
            address?: string | null;
            /** Phone */
            phone?: string | null;
            /** Maps Link */
            maps_link?: string | null;
            /** Latitude */
            latitude?: number | null;
            /** Longitude */
            longitude?: number | null;
            /** Is Active */
            is_active?: boolean | null;
        };
        /** LoyaltyCardCreate */
        LoyaltyCardCreate: {
            /** Customer Name */
            customer_name: string;
            /** Customer Email */
            customer_email: string;
        };
        /** LoyaltyCardPublic */
        LoyaltyCardPublic: {
            /** Serial Number */
            serial_number: string;
            /** Customer Name */
            customer_name: string;
            /** Customer Email */
            customer_email: string;
            /** Stamps */
            stamps: number;
            /** Stamps Required */
            stamps_required: number;
            /** Reward */
            reward: string;
            /** Reward Ready */
            reward_ready: boolean;
            /** Visits */
            visits: components["schemas"]["LoyaltyVisit"][];
            /** Pass Url */
            pass_url: string | null;
        };
        /** LoyaltyPassSent */
        LoyaltyPassSent: {
            /** Sent To */
            sent_to: string;
            /** Pass Url */
            pass_url: string;
        };
        /** LoyaltyProgramPublic */
        LoyaltyProgramPublic: {
            /**
             * Enabled
             * @default false
             */
            enabled: boolean;
            /**
             * Stamps Required
             * @default 10
             */
            stamps_required: number;
            /**
             * Reward
             * @default Corte gratis
             */
            reward: string;
            /** Background Color */
            background_color?: string | null;
            /** Foreground Color */
            foreground_color?: string | null;
            /** Label Color */
            label_color?: string | null;
            /** Apple Wallet Available */
            apple_wallet_available: boolean;
            /** Logo Url */
            logo_url?: string | null;
        };
        /** LoyaltyProgramSettings */
        LoyaltyProgramSettings: {
            /**
             * Enabled
             * @default false
             */
            enabled: boolean;
            /**
             * Stamps Required
             * @default 10
             */
            stamps_required: number;
            /**
             * Reward
             * @default Corte gratis
             */
            reward: string;
            /** Background Color */
            background_color?: string | null;
            /** Foreground Color */
            foreground_color?: string | null;
            /** Label Color */
            label_color?: string | null;
        };
        /**
         * LoyaltyScanResult
         * @description Lo que ve el barbero al escanear el QR del pase.
         */
        LoyaltyScanResult: {
            /** Serial Number */
            serial_number: string;
            /** Customer Name */
            customer_name: string;
            /** Customer Email */
            customer_email: string;
            /** Stamps */
            stamps: number;
            /** Stamps Required */
            stamps_required: number;
            /** Reward */
            reward: string;
            /** Reward Ready */
            reward_ready: boolean;
            /** Visits */
            visits: components["schemas"]["LoyaltyVisit"][];
            /** Pass Url */
            pass_url: string | null;
            /** Stamped Today */
            stamped_today: boolean;
            /**
             * Stamp Added
             * @default false
             */
            stamp_added: boolean;
        };
        /** LoyaltyVisit */
        LoyaltyVisit: {
            /**
             * Visit Date
             * Format: date-time
             */
            visit_date: string;
            /** Service */
            service: string;
            /** Redeemed */
            redeemed: boolean;
        };
        /** NotificationPreferencesPublic */
        NotificationPreferencesPublic: {
            /**
             * Upcoming
             * @default true
             */
            upcoming: boolean;
            /**
             * Upcoming Minutes
             * @default 15
             */
            upcoming_minutes: number;
            /**
             * Daily Summary
             * @default true
             */
            daily_summary: boolean;
            /**
             * Daily Summary Hour
             * @default 9
             */
            daily_summary_hour: number;
            /**
             * Reservation Changes
             * @default true
             */
            reservation_changes: boolean;
            /**
             * Day Close
             * @default true
             */
            day_close: boolean;
        };
        /** PaginatedReviewsResponse */
        PaginatedReviewsResponse: {
            /** Items */
            items: components["schemas"]["GoogleReviewPublic"][];
            /** Total */
            total: number;
            /** Page */
            page: number;
            /** Page Size */
            page_size: number;
            /** Total Pages */
            total_pages: number;
        };
        /** ProductBase */
        ProductBase: {
            /** Name */
            name: string;
            /** Price */
            price: number;
            /** Type */
            type?: string | null;
            /** Image Url */
            image_url?: string | null;
            /** Seller */
            seller?: string | null;
            /**
             * Duration Minutes
             * @default 30
             */
            duration_minutes: number | null;
        };
        /** ProductPublic */
        ProductPublic: {
            /** Name */
            name: string;
            /** Price */
            price: number;
            /** Type */
            type?: string | null;
            /** Image Url */
            image_url?: string | null;
            /** Seller */
            seller?: string | null;
            /**
             * Duration Minutes
             * @default 30
             */
            duration_minutes: number | null;
            /** Id */
            id: number;
        };
        /** ProductUpdate */
        ProductUpdate: {
            /** Name */
            name?: string | null;
            /** Price */
            price?: number | null;
            /** Type */
            type?: string | null;
            /** Image Url */
            image_url?: string | null;
            /** Seller */
            seller?: string | null;
            /** Duration Minutes */
            duration_minutes?: number | null;
        };
        /** PublicLoyaltyInfo */
        PublicLoyaltyInfo: {
            /** Enabled */
            enabled: boolean;
            /** Stamps Required */
            stamps_required: number;
            /** Reward */
            reward: string;
            /** Apple Wallet Available */
            apple_wallet_available: boolean;
        };
        /** PushTokenCreate */
        PushTokenCreate: {
            /** Token */
            token: string;
        };
        /** PushTokenPublic */
        PushTokenPublic: {
            /** Id */
            id: number;
            /** User Id */
            user_id: string;
            /** Token */
            token: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
        };
        /** RegistrationBody */
        RegistrationBody: {
            /** Pushtoken */
            pushToken: string;
        };
        /** RemindersSetting */
        RemindersSetting: {
            /** Reminders Enabled */
            reminders_enabled: boolean;
        };
        /** ReservationBase */
        ReservationBase: {
            /** Customer Name */
            customer_name: string;
            /** In Charge */
            in_charge: string | null;
            /**
             * Reservation Start Date
             * Format: date-time
             */
            reservation_start_date: string;
            /** Reservation End Date */
            reservation_end_date?: string | null;
            /** Time Per Reservation */
            time_per_reservation?: number | null;
            /** Status */
            status: string;
            /** Service */
            service: string;
            /** Customer Phone */
            customer_phone?: string | null;
            /** Customer Email */
            customer_email?: string | null;
        };
        /** ReservationPublic */
        ReservationPublic: {
            /** Customer Name */
            customer_name: string;
            /** In Charge */
            in_charge: string | null;
            /**
             * Reservation Start Date
             * Format: date-time
             */
            reservation_start_date: string;
            /**
             * Reservation End Date
             * Format: date-time
             */
            reservation_end_date: string;
            /** Time Per Reservation */
            time_per_reservation: number;
            /** Status */
            status: string;
            /** Service */
            service: string;
            /** Customer Phone */
            customer_phone?: string | null;
            /** Customer Email */
            customer_email?: string | null;
            /** Id */
            id: number;
        };
        /** ReservationUpdate */
        ReservationUpdate: {
            /** Customer Name */
            customer_name?: string | null;
            /** In Charge */
            in_charge?: string | null;
            /** Reservation Start Date */
            reservation_start_date?: string | null;
            /** Reservation End Date */
            reservation_end_date?: string | null;
            /** Time Per Reservation */
            time_per_reservation?: number | null;
            /** Status */
            status?: string | null;
            /** Service */
            service?: string | null;
            /** Customer Phone */
            customer_phone?: string | null;
            /** Customer Email */
            customer_email?: string | null;
        };
        /** RetellCall */
        RetellCall: {
            /** Call Id */
            call_id?: string | null;
            /** From Number */
            from_number?: string | null;
            /** To Number */
            to_number?: string | null;
            /** Retell Llm Dynamic Variables */
            retell_llm_dynamic_variables?: {
                [key: string]: string;
            };
        };
        /** SignupInput */
        SignupInput: {
            /** Email */
            email: string;
            /** Password */
            password: string;
            /** Fullname */
            fullName: string;
        };
        /** SubmitUrlRequest */
        SubmitUrlRequest: {
            /** Source Url */
            source_url: string;
        };
        /** SuccessResponse */
        SuccessResponse: {
            /** Success */
            success: boolean;
        };
        /** SyncResponse */
        SyncResponse: {
            /** New Reviews Count */
            new_reviews_count: number;
            /** Total Reviews */
            total_reviews: number;
            /** Last Sync At */
            last_sync_at: string;
        };
        /** TrendInsightPublic */
        TrendInsightPublic: {
            /** Id */
            id: number;
            /**
             * Day
             * Format: date
             */
            day: string;
            /** Analysis */
            analysis: string;
            /** Matched Services */
            matched_services: string[];
            /** Trends */
            trends: components["schemas"]["TrendUsed"][];
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /** Refreshed At */
            refreshed_at: string | null;
        };
        /** TrendUsed */
        TrendUsed: {
            /** Title */
            title: string;
            /**
             * Network
             * @enum {string}
             */
            network: "instagram" | "tiktok";
            /** Url */
            url: string;
        };
        /** UpdateEmployeeInput */
        UpdateEmployeeInput: {
            /** Role */
            role?: string | null;
            /** Status */
            status?: string | null;
            /** Locationid */
            locationId?: number | null;
        };
        /** ValidationError */
        ValidationError: {
            /** Location */
            loc: (string | number)[];
            /** Message */
            msg: string;
            /** Error Type */
            type: string;
        };
        /** VoiceAgentConfigPublic */
        VoiceAgentConfigPublic: {
            /** Enabled */
            enabled: boolean;
            /**
             * Booking Mode
             * @enum {string}
             */
            booking_mode: "request" | "confirm";
            /** Phone Numbers */
            phone_numbers: string[];
        };
        /** VoiceAgentConfigUpdate */
        VoiceAgentConfigUpdate: {
            /** Enabled */
            enabled?: boolean | null;
            /** Booking Mode */
            booking_mode?: ("request" | "confirm") | null;
        };
        /** VoiceCallDay */
        VoiceCallDay: {
            /** Date */
            date: string;
            /** Calls */
            calls: number;
            /** Bookings */
            bookings: number;
        };
        /** VoiceCallDetail */
        VoiceCallDetail: {
            /** Id */
            id: number;
            /** From Number */
            from_number: string | null;
            /**
             * Status
             * @enum {string}
             */
            status: "rejected" | "in_progress" | "ended";
            /**
             * Started At
             * Format: date-time
             */
            started_at: string;
            /** Ended At */
            ended_at: string | null;
            /** Duration Seconds */
            duration_seconds: number | null;
            /** Disconnection Reason */
            disconnection_reason: string | null;
            /** Summary */
            summary: string | null;
            /** Sentiment */
            sentiment: string | null;
            /** Successful */
            successful: boolean | null;
            /** Booking Mode */
            booking_mode: ("request" | "confirm") | null;
            /** Booking Id */
            booking_id: number | null;
            /** Transcript */
            transcript: string | null;
            /** Recording Url */
            recording_url: string | null;
        };
        /** VoiceCallPage */
        VoiceCallPage: {
            /** Items */
            items: components["schemas"]["VoiceCallPublic"][];
            /** Total */
            total: number;
        };
        /** VoiceCallPublic */
        VoiceCallPublic: {
            /** Id */
            id: number;
            /** From Number */
            from_number: string | null;
            /**
             * Status
             * @enum {string}
             */
            status: "rejected" | "in_progress" | "ended";
            /**
             * Started At
             * Format: date-time
             */
            started_at: string;
            /** Ended At */
            ended_at: string | null;
            /** Duration Seconds */
            duration_seconds: number | null;
            /** Disconnection Reason */
            disconnection_reason: string | null;
            /** Summary */
            summary: string | null;
            /** Sentiment */
            sentiment: string | null;
            /** Successful */
            successful: boolean | null;
            /** Booking Mode */
            booking_mode: ("request" | "confirm") | null;
            /** Booking Id */
            booking_id: number | null;
        };
        /** VoiceCallStats */
        VoiceCallStats: {
            /** Days */
            days: number;
            /** Total Calls */
            total_calls: number;
            /** Answered Calls */
            answered_calls: number;
            /** Rejected Calls */
            rejected_calls: number;
            /** Bookings */
            bookings: number;
            /** Booking Rate */
            booking_rate: number;
            /** Total Minutes */
            total_minutes: number;
            /** Avg Duration Seconds */
            avg_duration_seconds: number;
            /** Positive Calls */
            positive_calls: number;
            /** Negative Calls */
            negative_calls: number;
            /** Daily */
            daily: components["schemas"]["VoiceCallDay"][];
        };
        /** WeeklySummaryPublic */
        WeeklySummaryPublic: {
            /**
             * Week Start
             * Format: date
             */
            week_start: string;
            /**
             * Week End
             * Format: date
             */
            week_end: string;
            /** Narrative */
            narrative: string;
            /** Kpis */
            kpis: string;
            /** Client Narrative */
            client_narrative?: string | null;
            /** Id */
            id: number;
            /** Business Id */
            business_id: string;
            /**
             * Generated At
             * Format: date-time
             */
            generated_at: string;
        };
        /**
         * WorkingHoursInput
         * @description Input schema for creating/updating working hours blocks.
         */
        WorkingHoursInput: {
            /** Day Of Week */
            day_of_week: number;
            /** Start Time */
            start_time: string;
            /** End Time */
            end_time: string;
            /**
             * Enabled
             * @default true
             */
            enabled: boolean;
        };
        /** WorkingHoursPublic */
        WorkingHoursPublic: {
            /** Id */
            id: number;
            /** Day Of Week */
            day_of_week: number;
            /** Start Time */
            start_time: string;
            /** End Time */
            end_time: string;
            /** Enabled */
            enabled: boolean;
            /** Member User Id */
            member_user_id?: string | null;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    health_health_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
        };
    };
    signup_owner_endpoint_auth_signup_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SignupInput"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SuccessResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_access_context_auth_me_get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_employees_employees__get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EmployeePublic"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_employee_invite_employees__post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["InviteEmployeeInput"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InviteEmployeeResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    remove_employee_employees__member_user_id__delete: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                member_user_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SuccessResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    patch_employee_employees__member_user_id__patch: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                member_user_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateEmployeeInput"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EmployeePublic"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    complete_onboarding_employees_onboarding_complete_post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CompleteEmployeeOnboardingInput"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SuccessResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_reservations_reservations__get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReservationPublic"][];
                };
            };
            /** @description Not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_reservation_reservations__post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReservationBase"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReservationPublic"];
                };
            };
            /** @description Not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_reservation_by_id_reservations__reservation_id__get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                reservation_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReservationPublic"];
                };
            };
            /** @description Not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    delete_reservation_reservations__reservation_id__delete: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                reservation_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_reservation_reservations__reservation_id__patch: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                reservation_id: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReservationUpdate"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReservationPublic"];
                };
            };
            /** @description Not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    revert_reservation_reservations__reservation_id__revert_post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                reservation_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReservationPublic"];
                };
            };
            /** @description Not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_configuration_configuration__get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BusinessConfigurationPublic"][];
                };
            };
            /** @description Not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_configuration_configuration__post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BusinessConfigurationBase"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BusinessConfigurationPublic"];
                };
            };
            /** @description Not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_reminders_setting_configuration_reminders_get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RemindersSetting"];
                };
            };
            /** @description Not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_reminders_setting_configuration_reminders_put: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RemindersSetting"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RemindersSetting"];
                };
            };
            /** @description Not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    delete_configuration_configuration__configuration_id__delete: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                configuration_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_configuration_configuration__configuration_id__patch: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                configuration_id: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BusinessConfigurationUpdate"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BusinessConfigurationPublic"];
                };
            };
            /** @description Not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_products_products__get: {
        parameters: {
            query?: {
                offset?: number;
                limit?: number;
            };
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductPublic"][];
                };
            };
            /** @description Not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_product_products__post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ProductBase"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductPublic"];
                };
            };
            /** @description Not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_product_by_id_products__product_id__get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                product_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductPublic"];
                };
            };
            /** @description Not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    delete_product_products__product_id__delete: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                product_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_product_products__product_id__patch: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                product_id: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ProductUpdate"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductPublic"];
                };
            };
            /** @description Not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_finances_finances__get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FinancesPublic"][];
                };
            };
            /** @description Not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_finances_finances__post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FinancesBase"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FinancesPublic"];
                };
            };
            /** @description Not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_finances_by_id_finances__finances_id__get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                finances_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FinancesPublic"];
                };
            };
            /** @description Not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    delete_finances_finances__finances_id__delete: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                finances_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
            /** @description Not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_finances_finances__finances_id__patch: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                finances_id: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FinancesUpdate"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FinancesPublic"];
                };
            };
            /** @description Not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_annual_finances_finances_annual_finances__year__get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                year: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_profile_google_reviews_profile_get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GoogleBusinessProfilePublic"];
                };
            };
            /** @description Not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_profile_google_reviews_profile_post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SubmitUrlRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GoogleBusinessProfilePublic"];
                };
            };
            /** @description Not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    sync_reviews_google_reviews_sync_post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SyncResponse"];
                };
            };
            /** @description Not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_reviews_google_reviews_reviews_get: {
        parameters: {
            query?: {
                page?: number;
                page_size?: number;
                rating?: number | null;
                sort?: string;
                search?: string | null;
            };
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedReviewsResponse"];
                };
            };
            /** @description Not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    generate_response_for_review_google_reviews_reviews__review_db_id__generate_response_post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                review_db_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GenerateResponseResult"];
                };
            };
            /** @description Not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    generate_summary_google_reviews_summary_post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_working_hours_working_hours__get: {
        parameters: {
            query?: {
                /** @description Filter by member. Omit for business-wide. */
                member_user_id?: string | null;
            };
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkingHoursPublic"][];
                };
            };
            /** @description Not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    upsert_working_hours_working_hours__put: {
        parameters: {
            query?: {
                /** @description Set hours for a specific member. Omit for business-wide. */
                member_user_id?: string | null;
            };
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WorkingHoursInput"][];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkingHoursPublic"][];
                };
            };
            /** @description Not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_summary_intelligence_summary_get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WeeklySummaryPublic"];
                };
            };
            /** @description Not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    generate_summary_intelligence_summary_generate_post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WeeklySummaryPublic"];
                };
            };
            /** @description Not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_locations_public_book__business_id__locations_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                business_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_services_public_book__business_id__services_get: {
        parameters: {
            query?: {
                location_id?: number | null;
            };
            header?: never;
            path: {
                business_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_availability_public_book__business_id__availability_get: {
        parameters: {
            query: {
                date: string;
                employee_name?: string | null;
                service?: string | null;
            };
            header?: never;
            path: {
                business_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_booking_request_public_book__business_id__request_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                business_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BookingRequestCreate"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_booking_requests_booking_requests__get: {
        parameters: {
            query?: {
                status?: string | null;
            };
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BookingRequestPublic"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    accept_booking_request_booking_requests__request_id__accept_post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                request_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    reject_booking_request_booking_requests__request_id__reject_post: {
        parameters: {
            query?: {
                reason?: string | null;
            };
            header: {
                authorization: string;
            };
            path: {
                request_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_locations_locations__get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LocationPublic"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_location_locations__post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LocationCreate"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LocationPublic"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    delete_location_locations__location_id__delete: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                location_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_location_locations__location_id__patch: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                location_id: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LocationUpdate"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LocationPublic"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    register_push_token_users__user_id__push_tokens_post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                user_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PushTokenCreate"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PushTokenPublic"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    unregister_push_token_users__user_id__push_tokens_delete: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                user_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PushTokenCreate"];
            };
        };
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_notification_preferences_notification_preferences__get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotificationPreferencesPublic"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_notification_preferences_notification_preferences__put: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["NotificationPreferencesPublic"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotificationPreferencesPublic"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    chat_assistant_chat_post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ChatRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    confirm_action_assistant_actions__action_id__confirm_post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                action_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ConfirmActionRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_usage_assistant_usage_get: {
        parameters: {
            query?: {
                days?: number;
            };
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_conversations_assistant_conversations_get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_conversation_assistant_conversations__conversation_id__get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                conversation_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    delete_conversation_assistant_conversations__conversation_id__delete: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                conversation_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_content_preferences_trends_preferences_get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContentPreferencesPublic"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_content_preferences_trends_preferences_put: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ContentPreferencesPublic"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContentPreferencesPublic"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_insight_trends_insight_get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TrendInsightPublic"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    refresh_insight_trends_insight_refresh_post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TrendInsightPublic"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_suggestions_trends_suggestions_get: {
        parameters: {
            query?: {
                status?: ("pending" | "sent" | "opened" | "dismissed" | "published") | null;
            };
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContentSuggestionPublic"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_suggestion_trends_suggestions__suggestion_id__patch: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                suggestion_id: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ContentSuggestionStatusUpdate"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContentSuggestionPublic"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    ingest_internal_trends_ingest_post: {
        parameters: {
            query?: never;
            header?: {
                authorization?: string | null;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    analyze_internal_trends_analyze_post: {
        parameters: {
            query?: never;
            header?: {
                authorization?: string | null;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    dispatch_internal_trends_dispatch_post: {
        parameters: {
            query?: never;
            header?: {
                authorization?: string | null;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    run_internal_reminders_run_post: {
        parameters: {
            query?: never;
            header?: {
                authorization?: string | null;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_voice_agent_config_voice_agent_config_get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VoiceAgentConfigPublic"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_voice_agent_config_voice_agent_config_patch: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["VoiceAgentConfigUpdate"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VoiceAgentConfigPublic"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_voice_calls_voice_agent_calls_get: {
        parameters: {
            query?: {
                limit?: number;
                offset?: number;
                status?: string | null;
                booked?: boolean | null;
            };
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VoiceCallPage"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_voice_call_voice_agent_calls__call_id__get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                call_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VoiceCallDetail"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_voice_call_stats_voice_agent_stats_get: {
        parameters: {
            query?: {
                days?: number;
            };
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VoiceCallStats"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    inbound_call_retell_inbound_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["InboundWebhook"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    call_event_retell_webhook_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CallEvent"];
            };
        };
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    run_function_retell_functions__function_name__post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                function_name: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FunctionCall"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_customer_message_draft_customer_messages_draft_get: {
        parameters: {
            query: {
                email: string;
            };
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CustomerMessageDraft"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    send_customer_message_customer_messages__post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CustomerMessageCreate"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CustomerMessagePublic"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    find_customers_customers__get: {
        parameters: {
            query?: {
                q?: string;
                limit?: number;
            };
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CustomerPublic"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_customer_detail_customers_detail_get: {
        parameters: {
            query: {
                name: string;
            };
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CustomerDetail"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    delete_my_account_users_me_delete: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_program_loyalty_program_get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoyaltyProgramPublic"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_program_loyalty_program_put: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LoyaltyProgramSettings"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoyaltyProgramPublic"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_card_loyalty_cards_get: {
        parameters: {
            query?: {
                email?: string | null;
                name?: string | null;
            };
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoyaltyCardPublic"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_card_loyalty_cards_post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LoyaltyCardCreate"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoyaltyCardPublic"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    redeem_card_loyalty_cards__serial_number__redeem_post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                serial_number: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoyaltyCardPublic"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    send_pass_loyalty_cards__serial_number__send_pass_post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                serial_number: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoyaltyPassSent"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    scan_card_loyalty_scan__token__get: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                token: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoyaltyScanResult"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    stamp_scanned_card_loyalty_scan__token__stamp_post: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                token: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoyaltyScanResult"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    upload_program_logo_loyalty_program_logo_put: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": components["schemas"]["Body_upload_program_logo_loyalty_program_logo_put"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoyaltyProgramPublic"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    delete_program_logo_loyalty_program_logo_delete: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoyaltyProgramPublic"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_public_program_public_loyalty__business_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                business_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PublicLoyaltyInfo"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    download_pass_public_loyalty_passes__serial_number__pkpass_get: {
        parameters: {
            query: {
                token: string;
            };
            header?: never;
            path: {
                serial_number: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    register_device_wallet_apple_v1_devices__device_id__registrations__pass_type_id___serial_number__post: {
        parameters: {
            query?: never;
            header?: {
                authorization?: string | null;
            };
            path: {
                device_id: string;
                pass_type_id: string;
                serial_number: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RegistrationBody"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    unregister_device_wallet_apple_v1_devices__device_id__registrations__pass_type_id___serial_number__delete: {
        parameters: {
            query?: never;
            header?: {
                authorization?: string | null;
            };
            path: {
                device_id: string;
                pass_type_id: string;
                serial_number: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    updated_serials_wallet_apple_v1_devices__device_id__registrations__pass_type_id__get: {
        parameters: {
            query?: {
                passesUpdatedSince?: string | null;
            };
            header?: never;
            path: {
                device_id: string;
                pass_type_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    latest_pass_wallet_apple_v1_passes__pass_type_id___serial_number__get: {
        parameters: {
            query?: never;
            header?: {
                authorization?: string | null;
                "if-modified-since"?: string | null;
            };
            path: {
                pass_type_id: string;
                serial_number: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    wallet_log_wallet_apple_v1_log_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
        };
    };
}
