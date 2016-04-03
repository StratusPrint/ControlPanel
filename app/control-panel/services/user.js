app.service('user', UserService);

UserService.$inject = ['localStorageService'];

function UserService(localStorageService) {
    /**
     * Retrieve user from browser's local storage (if available) upon
     * first instantiation of the User service.
     */
    this._user = JSON.parse(localStorageService.get('user'));

    /**
     * Get current user.
     *
     * @return {JSON} A JSON representation of the current user
     */
    this.get = function() {
        return this._user;
    };

    /**
     * Set current user.
     *
     * @return {JSON} A JSON representation of the current user
     */
    this.set = function(user) {
        this._user = user;
        localStorageService.set('user', JSON.stringify(user));
        return this;
    };

    /**
     * Get current user's e-mail address.
     *
     * @return {String} The current user's e-mail address
     */
    this.email = function() {
        return this._user.email;
    };

    /**
     * Get current user's name.
     *
     * @return {String} The current user's name
     */
    this.name = function() {
        return this._user.name;
    };

    /**
     * Get current user's profile image.
     *
     * @return {String} The current user's profile image.
     */
    this.image = function() {
        return this._user.image;
    };

    /**
     * Check whether current user is authenticated or not.
     *
     * @return {Boolean} true if authenticated, false otherwise
     */
    this.isAuthenticated = function() {
        if (this._user === null || this._user === undefined) {
            return false;
        }

        return this._user.signedIn;
    };

    /**
     * Check whether current user has admin priveleges.
     *
     * @return {Boolean} true if user has admin priveleges, false otherwise
     */
    this.isAdmin = function() {
        return this._user.admin;
    };

    /**
     * Destroy current user and remove from the brower's local
     * storage.
     */
    this.destroy = function() {
        this.set(null);
        localStorageService.remove('user');
    };
}
