//
//  ViewController.h
//  VCContainmentTut
//
//  Created by A Khan on 02/05/2013.
//  Copyright (c) 2013 AK. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <MapKit/MapKit.h>
@interface ViewController : UIViewController

@property(nonatomic) NSString *isSomethingEnabled;

@property (nonatomic,retain) IBOutlet UILabel *doyLabel;
@property (weak, nonatomic) IBOutlet MKMapView *mapView;

@end
