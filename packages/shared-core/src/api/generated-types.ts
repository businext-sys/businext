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
         * @description Return PENDING reservations from the last 7 days onward + COMPLETED from today.
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
         * @description Revert a COMPLETED reservation back to PENDING and delete its linked finance.
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
         * @description Returns available time slots for a given date and optional employee.
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
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
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
        /** CompleteEmployeeOnboardingInput */
        CompleteEmployeeOnboardingInput: {
            /** Password */
            password: string;
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
            /** Is Active */
            is_active?: boolean | null;
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
            time_per_reservation: number;
            /** Status */
            status?: string | null;
            /** Service */
            service?: string | null;
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
}
