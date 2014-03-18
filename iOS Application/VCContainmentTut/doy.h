//
//  doy.h
//  VCContainmentTut
//
//  Created by Θεόδωρος Δεληγιαννίδης on 8/26/13.
//  Copyright (c) 2013 AK. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "ViewController.h"
#import <MapKit/MapKit.h>

@interface doy :UIViewController <MKMapViewDelegate,UINavigationControllerDelegate,UIActionSheetDelegate>
{
    CLLocationCoordinate2D userLocationCoords;
    NSString *address;
    NSString *currentLoc;
    CLGeocoder *reverseGeo;
    UIImageView *userLocationImg;
    UIActivityIndicatorView *activityIndicator;
    UIImageView *refreshMapImg;

}
@property (weak, nonatomic) IBOutlet MKMapView *mapView;

- (IBAction)showActionSheet:(id)sender;


@end
