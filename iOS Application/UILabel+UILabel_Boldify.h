//
//  UILabel+UILabel_Boldify.h
//  VCContainmentTut
//
//  Created by Θεόδωρος Δεληγιαννίδης on 2/19/14.
//  Copyright (c) 2014 AK. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UILabel (UILabel_Boldify)
- (void) boldSubstring: (NSString*) substring;
- (void) boldRange: (NSRange) range;
@end
