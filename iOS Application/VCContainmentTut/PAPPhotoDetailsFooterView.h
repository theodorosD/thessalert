//
//  PAPPhotoDetailsFooterView.h
//  Anypic
//
//  Created by Mattieu Gamache-Asselin on 5/16/12.
//

@interface PAPPhotoDetailsFooterView : UIView

@property (nonatomic, strong) UITextField *commentField;

@property (nonatomic) BOOL hideDropShadow;

+ (CGRect)rectForView;

@end
