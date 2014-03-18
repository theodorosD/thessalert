//
//  showAlertImageView.m
//  VCContainmentTut
//
//  Created by Θεόδωρος Δεληγιαννίδης on 2/2/14.
//  Copyright (c) 2014 AK. All rights reserved.
//

#import "showAlertImageView.h"

@interface showAlertImageView ()
@property (nonatomic, strong) UIScrollView *scrollView;

@end

@implementation showAlertImageView

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}
- (void)loadView {
    self.scrollView = [[UIScrollView alloc] initWithFrame:[[UIScreen mainScreen] applicationFrame]];
    self.scrollView.backgroundColor = [UIColor blackColor];
    self.scrollView.delegate = self;
    self.view = self.scrollView;
    self.view.opaque=YES;
    
    UIImageView *alertImage=[[UIImageView alloc] initWithFrame:CGRectMake(0,20,self.scrollView.frame.size.width,self.scrollView.frame.size.height)];
    alertImage.contentMode=UIViewContentModeScaleAspectFit;
    alertImage.image=_alertImagePassed;
    UITapGestureRecognizer *showImage=[[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(dismissThis)];
    [alertImage addGestureRecognizer:showImage];
    alertImage.userInteractionEnabled=YES;
    [self.scrollView addSubview:alertImage];
}

- (void)viewDidLoad
{
    [super viewDidLoad];
}
- (void)dismissThis
{
    [self dismissViewControllerAnimated:YES completion:NULL];
    self.alertImagePassed=NULL;
}
- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
    _alertImagePassed=NULL;
}
@end
