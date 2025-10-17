=== WpstormCleanAdmin ===
Contributors: wpstormdev
Tags: user management, inactive users, security, optimization, admin tools
Requires at least: 5.0
Tested up to: 6.8
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

A modern WordPress plugin for managing inactive users, monitoring site activity, and keeping your WordPress site optimized and secure.

== Description ==

**WpstormCleanAdmin** is a modern, performance-focused WordPress plugin that helps you manage inactive users, monitor activity, and keep your WordPress dashboard clean and optimized.

Built with a React-powered interface and following WordPress coding standards, it delivers a seamless and efficient experience for both administrators and site managers.

### 🧠 Key Highlights

- 🚀 **Lightweight & Fast:** Designed with performance in mind, using native WordPress APIs.
- 🧍‍♂️ **Smart User Management:** Automatically detect, deactivate, or delete inactive users.
- 📊 **Advanced Analytics:** Visualize user login activity, registrations, and engagement patterns.
- ⚙️ **Customizable Automation:** Schedule cleanups and inactivity checks that fit your workflow.
- 🔒 **Security First:** Protects admin and critical roles from accidental removal.
- 🎨 **Modern React UI:** Sleek, responsive dashboard that feels native to WordPress.

### 💡 Why Use WpstormCleanAdmin?

Over time, inactive users can clutter your database, pose security risks, and affect performance.
**WpstormCleanAdmin** helps you:
- Keep your user list clean and efficient
- Identify dormant or risky accounts
- Automate repetitive maintenance tasks
- Improve login and engagement visibility
- Stay compliant with GDPR by removing unused accounts

### 🧰 Built For Developers and Admins

- 100% compatible with WordPress coding and security standards
- Fully translatable and ready for localization
- Uses WordPress REST API for scalability and speed

### 🌍 Compatibility

- Works with WordPress 5.0+
- Tested up to 6.8.3
- Compatible with classic and block themes
- Translation-ready (`.pot` file included)

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

= 1.0.0 =
* Initial release
* Inactive user detection and management
* User activity tracking
* Analytics dashboard
* Automated cleanup scheduling
* Role-based exclusions
* Bulk user actions

== Upgrade Notice ==

= 1.0.0 =
Initial release of WpstormCleanAdmin.

== Privacy Policy ==

WpstormCleanAdmin tracks user login times locally in your database. No data is sent to external servers. All data remains on your WordPress installation.

== Roadmap ==

* Add multisite compatibility
* Add email notifications for inactive users
* Add export/import for cleanup logs
* Integration with WooCommerce user activity

== Support ==

For documentation, FAQs, and support, visit:
👉 [https://wpstorm.ir/clean-admin/](https://wpstorm.ir/clean-admin/)

== Feedback & Contribution ==

We welcome feedback and contributions!
Share your ideas or report issues at:
👉 [https://wpstorm.ir/support](https://wpstorm.ir/support)

== Credits ==

Developed by the **Wpstorm Team**
Website: [https://wpstorm.ir](https://wpstorm.ir)
