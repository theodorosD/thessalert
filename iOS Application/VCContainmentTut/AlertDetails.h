//
//  AlertDetails.h
//  VCContainmentTut
//
//  Created by Θεόδωρος Δεληγιαννίδης on 1/12/14.
//  Copyright (c) 2014 AK. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <CoreLocation/CoreLocation.h>

@interface AlertDetails : UIViewController<UIScrollViewDelegate>{

    CLLocationCoordinate2D alertCoords;
    NSInteger sendAlertID;
    UIImageView *backgroundRect;
    UIColor *ios7BlueColor;
    UIImage *FullAlertImage;
}

@property (nonatomic, assign) CLLocationCoordinate2D alertCoords;
@property (nonatomic) NSInteger sendAlertID;
@property (nonatomic) NSString  *sendAlertTitle;
@property (nonatomic) NSString  *sendAlertDescr;
@property (nonatomic) NSString  *sendAlertDate;
@property (nonatomic) NSString  *sendAlertType;
@property (nonatomic) NSString  *sendAlertImage;
@property (nonatomic) NSString  *sendAlertTypename;
@property (nonatomic) NSString  *sendAlertLat;
@property (nonatomic) NSString  *sendAlertLng;
@property (nonatomic) NSString  *sendAlertaddress;


@property (strong, nonatomic) IBOutlet UIScrollView *alertDetailScroll;
@property (strong, nonatomic) IBOutlet UIImageView *alertImageview;

@property (strong, nonatomic) IBOutlet UILabel *lblAlerttitle;
@property (strong, nonatomic) IBOutlet UILabel *lblAlertdescr;
@property (strong, nonatomic) IBOutlet UILabel *lblAlertAdr;
@property (strong, nonatomic) IBOutlet UILabel *lblAlertDate;
@property (strong, nonatomic) IBOutlet UILabel *lblAlertType;

@end
