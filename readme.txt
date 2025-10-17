=== WpstormCleanAdmin ===
Contributors: wpstorm
Tags: user management, inactive users, analytics, security, optimization
Requires at least: 5.0
Tested up to: 6.7
Requires PHP: 7.4
Stable tag: 1.0.1
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

A modern WordPress plugin for managing inactive users, monitoring site activity, and keeping your WordPress site optimized and secure.

== Description ==

**Clean Admin** is a modern WordPress plugin designed to help site owners and administrators keep their websites optimized, secure, and user-friendly. With a minimal yet powerful dashboard, Clean Admin provides smart tools for monitoring, communication, recovery, and user management.

= Features =

* **Inactive Users Management** – Automatically detect and manage inactive user accounts
* **User Activity Tracking** – Track user login activities and last login times
* **Automated Cleanup** – Schedule automatic cleanup of inactive users with customizable criteria
* **Analytics Dashboard** – View comprehensive site activity, user engagement, and statistics
* **Role-Based Exclusions** – Exclude specific user roles from inactivity checks
* **Flexible Actions** – Choose to deactivate or delete inactive users
* **Activity Charts** – Visualize user registration and login patterns over time
* **Bulk Actions** – Perform actions on multiple users at once
* **Security-Focused** – Built with WordPress security best practices
* **Modern UI** – Clean, responsive interface built with React

= Use Cases =

* Keep your user database clean and optimized
* Identify and manage dormant accounts for security
* Monitor user activity and engagement patterns
* Automate routine user management tasks
* Maintain GDPR compliance by removing inactive accounts

= Getting Started =

1. Install and activate the plugin
2. Navigate to **Clean Admin** in your WordPress admin menu
3. Configure your inactivity threshold and exclusion rules
4. Choose automatic cleanup schedule or manage users manually
5. Monitor your users through the analytics dashboard

== Installation ==

= Automatic Installation =

1. Log in to your WordPress admin panel
2. Navigate to Plugins → Add New
3. Search for "WpstormCleanAdmin"
4. Click "Install Now" and then "Activate"

= Manual Installation =

1. Download the plugin ZIP file
2. Log in to your WordPress admin panel
3. Navigate to Plugins → Add New → Upload Plugin
4. Choose the ZIP file and click "Install Now"
5. Activate the plugin through the Plugins menu

= After Activation =

1. Go to **Clean Admin** in the dashboard sidebar
2. Configure your settings under the Settings tab
3. Set up your inactivity criteria and excluded roles
4. Optionally, enable automatic cleanup scheduling

== Frequently Asked Questions ==

= What happens to inactive users? =

You can choose to either deactivate users (assign them an "inactive" role) or permanently delete them. This is configurable in the plugin settings.

= Can I exclude certain user roles? =

Yes, you can exclude specific user roles from inactivity checks. Administrator role is always excluded by default for safety.

= How is inactivity determined? =

Inactivity is based on the last login time. If a user hasn't logged in within your specified number of days, they're considered inactive.

= Does this work with multisite? =

The current version is designed for single-site installations. Multisite compatibility is planned for future releases.

= Is it safe to automatically delete users? =

The plugin includes safeguards like role exclusions and administrator protection. However, we recommend reviewing inactive users before enabling automatic deletion.

= Can I restore deleted users? =

Once users are deleted, they cannot be restored through the plugin. Always backup your database before performing bulk deletions.

== Screenshots ==

1. Main dashboard showing user statistics and activity
2. Inactive users management interface
3. Settings panel for configuring inactivity criteria
4. Activity chart showing login and registration patterns
5. User action logs and history

== Changelog ==

= 1.0.1 =
* Fixed plugin description
* Added security improvements for input sanitization
* Improved SQL query security
* Code cleanup and optimization

= 1.0.0 =
* Initial release
* Inactive user detection and management
* User activity tracking
* Analytics dashboard
* Automated cleanup scheduling
* Role-based exclusions
* Bulk user actions

== Upgrade Notice ==

= 1.0.1 =
Security improvements and bug fixes. Recommended update for all users.

= 1.0.0 =
Initial release of WpstormCleanAdmin.

== Privacy Policy ==

WpstormCleanAdmin tracks user login times locally in your database. No data is sent to external servers. All data remains on your WordPress installation.

== Support ==

For support and documentation, visit: https://wpstorm.ir/clean-admin/

== Credits ==

Developed by Wpstorm Team
