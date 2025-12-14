/**
 * @file hasRestaurantRole.middlewares.js
 * @module middlewares/MiddlewaresReservation/hasRestaurantRole
 * @description Middleware de autorización basado en roles para recursos de restaurante.
 */

/**
 * @file hasRestaurantRole.middlewares.js
 * @module middlewares/MiddlewaresReservation/hasRestaurantRole
 * @description Middleware de autorización basado en roles para recursos de restaurante.
 */

/**
 * Middleware de autorización basado en roles para recursos de restaurante.
 * Permite acceso solo si el usuario tiene uno de los roles requeridos sobre el restaurante asociado al recurso.
 * @function hasRestaurantRole
 * @param {Array<string>} requiredRoles - Roles permitidos (por ejemplo: ['owner', 'operator'])
 * @param {string} [idParamName="id"] - Nombre del parámetro de ruta que contiene el ID del recurso
 * @returns {Function} Middleware Express
 */
const hasRestaurantRole = (requiredRoles, idParamName = "id") =>
  asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    let restaurantId;

    const resourceId = req.params[idParamName];

    if (!resourceId) {
      res.status(500);
      throw new Error(`Missing required ID parameter: ${idParamName}.`);
    }

    // Si el recurso es un post, obtener el restaurante asociado al post
    if (idParamName === "postId") {
      const post = await Post.findById(resourceId).select("authorRestaurantId");
      if (!post) {
        res.status(404);
        throw new Error("Post not found.");
      }
      restaurantId = post.authorRestaurantId;
      req.post = post;
    } else if (idParamName === "reservationId") {
      // Si el recurso es una reservación, obtener el restaurante asociado
      const reservation = await Reservation.findById(resourceId).select(
        "restaurantId"
      );
      if (!reservation) {
        res.status(404);
        throw new Error("Reservation not found.");
      }
      restaurantId = reservation.restaurantId;
    } else {
      restaurantId = resourceId;
    }

    if (!restaurantId) {
      res.status(500);
      throw new Error("Missing restaurant ID in request parameters.");
    }

    // Buscar el rol del usuario sobre el restaurante
    const businessUser = await BusinessUser.findOne({
      user: userId,
      restaurant: restaurantId,
    });

    if (!businessUser) {
      res.status(403);
      throw new Error("You have no permission to manage this restaurant.");
    }

    const userRole = businessUser.role;

    if (requiredRoles.includes(userRole)) {
      req.userRole = userRole;
      next();
    } else {
      res.status(403);
      throw new Error("You have no permission to perform this action.");
    }
  });
