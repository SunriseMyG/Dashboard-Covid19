CREATE TABLE IF NOT EXISTS `data` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `date` date NULL,
    `province` varchar(255) NULL,
    `country` varchar(255) NULL,
    `last_update` datetime NULL,
    `latitude` float NULL,
    `longitude` float NULL,
    `confirmed` int(11) NULL,
    `deaths` int(11) NULL,
    `recovered` int(11) NULL,
    `active` int(11) NULL,
    `combined_key` varchar(255) NULL,
    `incident_rate` float NULL,
    `case_fatality_ratio` float NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
