//
//  showAlertImageView.h
//  VCContainmentTut
//
//  Created by Θεόδωρος Δεληγιαννίδης on 2/2/14.
//  Copyright (c) 2014 AK. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface showAlertImageView : UIViewController< UIScrollViewDelegate>{

}
@property (nonatomic,retain) UIImage *alertImagePassed;
@property (nonatomic, retain) IBOutlet UIImageView *imageView;

@end
