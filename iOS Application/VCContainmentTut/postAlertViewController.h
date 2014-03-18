//
//  postAlertViewController.h
//  VCContainmentTut
//
//  Created by Θεόδωρος Δεληγιαννίδης on 1/17/14.
//  Copyright (c) 2014 AK. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <MapKit/MapKit.h>

@interface postAlertViewController : UIViewController<UINavigationControllerDelegate, UIImagePickerControllerDelegate,UIPopoverControllerDelegate,UIActionSheetDelegate,UIAccelerometerDelegate,UITextFieldDelegate, UIScrollViewDelegate>{
    
    UINavigationBar * navBar;
    UIImageView *photoImageView;
    UIBarButtonItem *sendItem;
    UIImage *uiback;
    
}


@property (nonatomic, retain) UIImage   *cameraImage;
@property (nonatomic) NSInteger alertPassType;
@property (nonatomic) CLLocationCoordinate2D userLocationCoords;
@property (nonatomic, strong) MKPlacemark *placemark;
- (void)sendAlert:(id)sender;

@end
