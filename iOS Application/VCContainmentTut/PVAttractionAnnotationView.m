//
//  PVAttractionAnnotationView.m
//  VCContainmentTut
//
//  Created by Θεόδωρος Δεληγιαννίδης on 1/13/14.
//  Copyright (c) 2014 AK. All rights reserved.
//

#import "PVAttractionAnnotationView.h"
#import "Annotation.h"
#import "AppDelegate.h"

@implementation PVAttractionAnnotationView

- (id)initWithAnnotation:(id<MKAnnotation>)annotation reuseIdentifier:(NSString *)reuseIdentifier {
    self = [super initWithAnnotation:annotation reuseIdentifier:reuseIdentifier];
    if (self) {
        Annotation *attractionAnnotation = self.annotation;
        /*NSURL * imageURL = [NSURL URLWithString:[NSString stringWithFormat:@"%@",attractionAnnotation.alertAddress]];
        NSLog(@"%@",attractionAnnotation.alertAddress);
        NSData * imageData = [NSData dataWithContentsOfURL:imageURL];
        UIImage * image = [UIImage imageWithData:imageData];
        self.image=image;
        */

        switch (attractionAnnotation.type) {
            case 1:
                self.image = [UIImage imageNamed:@"red.png"];
                break;
            case 2:
                self.image = [UIImage imageNamed:@"blue.png"];
                break;
            case 3:
                self.image = [UIImage imageNamed:@"yellow.png"];
            break;
            case 4:
                self.image = [UIImage imageNamed:@"green.png"];
                break;
            case 5:
                self.image = [UIImage imageNamed:@"purple.png"];
                break;
            }
        
    }
    
    return self;
}
- (UIImage *)imageByDrawingCircleOnImage:(UIImage *)image
{
    UIColor *alizarinRed=[UIColor colorWithRed:231.0/255.0 green:76.0/255.0 blue:60.0/255.0 alpha:1.0f];

	// begin a graphics context of sufficient size
	UIGraphicsBeginImageContext(image.size);
    
	// draw original image into the context
	[image drawAtPoint:CGPointZero];
    
	// get the context for CoreGraphics
	CGContextRef ctx = UIGraphicsGetCurrentContext();
    
	// set stroking color and draw circle
	[alizarinRed setStroke];
    
	// make circle rect 5 px from border
	CGRect circleRect = CGRectMake(0, 0,
                                   image.size.width+10,
                                   image.size.height+10);
	circleRect = CGRectInset(circleRect, 15, 15);
    
	// draw circle
	CGContextStrokeEllipseInRect(ctx, circleRect);
    
	// make image out of bitmap context
	UIImage *retImage = UIGraphicsGetImageFromCurrentImageContext();
    
	// free the context
	UIGraphicsEndImageContext();
    
	return retImage;
}
@end