//
//  UILabel+UILabel_Boldify.m
//  VCContainmentTut
//
//  Created by Θεόδωρος Δεληγιαννίδης on 2/19/14.
//  Copyright (c) 2014 AK. All rights reserved.
//

#import "UILabel+UILabel_Boldify.h"

@implementation UILabel (UILabel_Boldify)
- (void)boldRange:(NSRange)range {
    if (![self respondsToSelector:@selector(setAttributedText:)]) {
        return;
    }
    NSMutableAttributedString *attributedText;
    if (!self.attributedText) {
        attributedText = [[NSMutableAttributedString alloc] initWithString:self.text];
    } else {
        attributedText = [[NSMutableAttributedString alloc]initWithAttributedString:self.attributedText];
    }
    [attributedText setAttributes:@{NSFontAttributeName:[UIFont boldSystemFontOfSize:self.font.pointSize]} range:range];
    self.attributedText = attributedText;
}

- (void)boldSubstring:(NSString*)substring {
    NSRange range = [self.text rangeOfString:substring];
    [self boldRange:range];
}
@end

