Η εγκατάσταση της εφαρμογής  στο δικό σας server απαιτεί τα εξής:
1)Apache web server
2)PHP 5.5
3)Mysql
4)Mailchimp λογαριασμό(Για τις ειδοποιήσεις με email)
5)Twilio λογαριασμό(Για τις ειδοποιήσεις με sms)

Θα πρέπει να δημιουργήσετε μια βάση δεδομένων με τα εξής table:
alerts
CREATE TABLE `alerts` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `title` varchar(30) NOT NULL COMMENT 'Info box title',
 `description` varchar(300) NOT NULL COMMENT 'description of alert',
 `lat` varchar(30) NOT NULL COMMENT 'latitude',
 `lng` varchar(30) NOT NULL COMMENT 'longitude',
 `alerttype` varchar(4) NOT NULL COMMENT 'alert type',
 `image` varchar(80) NOT NULL COMMENT 'Location image',
 `time` datetime NOT NULL COMMENT 'Alert date',
 `address` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT 'Addreess of the marker',
 `name` varchar(60) NOT NULL COMMENT 'Name of sender',
 `email` varchar(50) NOT NULL COMMENT 'Email of sender',
 `ip` varchar(60) NOT NULL COMMENT 'IP of sender',
 `showhide` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'show/hide entry',
 UNIQUE KEY `id` (`id`),
 KEY `alerttype` (`alerttype`)
) ENGINE=MyISAM AUTO_INCREMENT=141 DEFAULT CHARSET=utf8

alert_type:
CREATE TABLE `alert_types` (
 `id` int(11) NOT NULL COMMENT 'id of alert type',
 `alert_name` varchar(60) NOT NULL COMMENT 'alert type name',
 `alert_icon` varchar(100) NOT NULL COMMENT 'alert icon',
 UNIQUE KEY `id` (`id`),
 KEY `alert_name` (`alert_name`),
 KEY `alert_icon` (`alert_icon`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8

sms_subscribers:
CREATE TABLE `sms_subscribers` (
 `id` int(2) NOT NULL AUTO_INCREMENT,
 `telNumber` bigint(10) NOT NULL COMMENT 'τηλεφωνο κινητο',
 `generatedID` varchar(5) NOT NULL COMMENT '5ψηφιος κωδικος',
 `isRegistered` tinyint(4) NOT NULL DEFAULT '0' COMMENT 'εχει γινει πιστοποιηση?',
 PRIMARY KEY (`id`),
 UNIQUE KEY `telNumber` (`telNumber`)
) ENGINE=MyISAM AUTO_INCREMENT=22 DEFAULT CHARSET=utf8

Συμπληρώστε τις σωστές ρυθμίσεις στο αρχείο db.php.


This application use the following software:

1)Javascript EXIF Reader - jQuery plugin 0.1.3
Jacob Seidelin, cupboy@gmail.com, http://blog.nihilogic.dk/
Licensed under the MPL License

2)jQuery canvasResize plugin
Original author: @gokercebeci 
Licensed under the MIT license

3)InfoBox
Gary Little
Copyright 2010 Gary Little [gary at luxcentral.com]
Licensed under the Apache License

4)Bootstrap v3.0.2 by @fat and @mdo
Copyright 2013 Twitter, Inc.
Licensed under http://www.apache.org/licenses/LICENSE-2.0

5)Fancyapp image gallery
http://fancyapps.com/fancybox/
