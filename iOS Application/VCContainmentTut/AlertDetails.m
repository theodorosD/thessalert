//
//  AlertDetails.m
//  VCContainmentTut
//
//  Created by Θεόδωρος Δεληγιαννίδης on 1/12/14.
//  Copyright (c) 2014 AK. All rights reserved.
//

#import "AlertDetails.h"
#import "AFNetworking.h"
#import <CoreImage/CoreImage.h>
#import "showAlertImageView.h"

@interface AlertDetails ()
{
    UIImageView *imageHint;
}
@end

@implementation AlertDetails
@synthesize alertCoords,sendAlertID,sendAlertDate,sendAlertDescr,sendAlertImage,sendAlertLat,sendAlertLng,sendAlertTitle,sendAlertType,sendAlertTypename,sendAlertaddress,alertDetailScroll,alertImageview,lblAlertAdr,lblAlertDate,lblAlertdescr,lblAlerttitle,lblAlertType;


- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    NSURLRequest *url=[NSURLRequest  requestWithURL:[NSURL URLWithString:[NSString stringWithFormat:@"http://localhost/assets/alertimages/thumb_%@",sendAlertImage]]];
    ios7BlueColor = [UIColor colorWithRed:0.0 green:122.0/255.0 blue:1.0 alpha:1.0];
    
    AFHTTPRequestOperation *postOperation = [[AFHTTPRequestOperation alloc] initWithRequest:url];
    postOperation.responseSerializer = [AFImageResponseSerializer serializer];
    [postOperation setCompletionBlockWithSuccess:^(AFHTTPRequestOperation *operation, id responseObject) {
        alertImageview.image = responseObject;
    } failure:^(AFHTTPRequestOperation *operation, NSError *error) {
       // NSLog(@"Image error: %@", error);
    }];
    [postOperation start];
    
    alertImageview=[[UIImageView alloc]initWithFrame:CGRectMake(0, 60, self.view.frame.size.width,150 )];
    UITapGestureRecognizer *showImage=[[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(showAlertimg)];
    [alertImageview addGestureRecognizer:showImage];
    alertImageview.userInteractionEnabled=NO;
    
    CALayer * layer=alertImageview.layer;
    layer.masksToBounds = NO;
    layer.shadowRadius = 3.0f;
    layer.shadowOffset = CGSizeMake(0.0f, 2.0f);
    layer.shadowOpacity = 0.5f;
    layer.shouldRasterize = YES;
    
    UIImage *arrowsOut=[UIImage imageNamed:@"09-arrows-out.png"];
    arrowsOut=[arrowsOut  imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate];
    
    imageHint=[[UIImageView alloc]initWithImage:arrowsOut];
    imageHint.frame=CGRectMake(alertImageview.frame.size.width-arrowsOut.size.width-5,alertImageview.frame.size.height-arrowsOut.size.height+55,arrowsOut.size.width,arrowsOut.size.height);
    imageHint.alpha=0.0;
    imageHint.tintColor=ios7BlueColor;
    
    alertDetailScroll = [[UIScrollView alloc] initWithFrame:CGRectMake(0,alertImageview.frame.size.height+alertImageview.frame.origin.y+5, self.view.frame.size.width, self.view.frame.size.height)];
    alertDetailScroll.delegate=self;
    alertDetailScroll.backgroundColor=[UIColor whiteColor];
    
    UILabel *lblTitle=[[UILabel alloc]initWithFrame:CGRectMake( 40,10,alertDetailScroll.frame.size.width-10, 16)];
    
    lblAlerttitle=[[UILabel alloc] initWithFrame:CGRectMake( 40,lblTitle.frame.origin.y+lblTitle.frame.size.height,alertDetailScroll.frame.size.width-10, 32) ];
    
    UIView *lineView = [[UIView alloc] initWithFrame:CGRectMake(40, lblAlerttitle.frame.origin.y+lblAlerttitle.frame.size.height, self.view.bounds.size.width, 1)];
    lineView.backgroundColor = ios7BlueColor;
    [alertDetailScroll addSubview:lineView];
    
    
    UILabel *lblTitleDesc=[[UILabel alloc]initWithFrame:CGRectMake( 40,lineView.frame.origin.y+lineView.frame.size.height+5,alertDetailScroll.frame.size.width-10, 16)];

    lblAlertdescr=[[UILabel alloc] initWithFrame:CGRectMake(40, lblTitleDesc.frame.origin.y+lblTitleDesc.frame.size.height,alertDetailScroll.frame.size.width-55 , 64) ];

    UIView *lineView2 = [[UIView alloc] initWithFrame:CGRectMake(40, lblAlertdescr.frame.origin.y+lblAlertdescr.frame.size.height, self.view.bounds.size.width, 1)];
    lineView2.backgroundColor = ios7BlueColor;
    [alertDetailScroll addSubview:lineView2];

    lblAlertDate=[[UILabel alloc] initWithFrame:CGRectMake(40, lineView2.frame.origin.y+lineView2.frame.size.height,alertDetailScroll.frame.size.width-10 , 16) ];
    
    lblAlertAdr=[[UILabel alloc] initWithFrame:CGRectMake(40, lblAlertDate.frame.origin.y+lblAlertDate.frame.size.height,alertDetailScroll.frame.size.width-20, 48) ];
    
    
    alertDetailScroll.contentSize=CGSizeMake(self.view.frame.size.width , self.view.frame.size.height+50);
    
    alertImageview.contentMode=UIViewContentModeScaleToFill;
    
    lblAlerttitle.textAlignment=NSTextAlignmentLeft;
    lblAlertdescr.textAlignment=NSTextAlignmentLeft;
    lblAlertDate.textAlignment=NSTextAlignmentLeft;
    lblAlertAdr.textAlignment=NSTextAlignmentLeft;

    lblTitle.numberOfLines=0;
    lblAlerttitle.numberOfLines=0;
    lblAlertdescr.numberOfLines=0;
    lblAlertDate.numberOfLines=0;
    lblAlertAdr.numberOfLines=0;
    
    
    lblAlerttitle.lineBreakMode = NSLineBreakByWordWrapping;
    lblAlertdescr.lineBreakMode = NSLineBreakByCharWrapping;
    lblAlertAdr.lineBreakMode = NSLineBreakByWordWrapping;

    lblTitle.text=@"Τίτλος";
    lblTitle.textColor=ios7BlueColor;
    lblTitleDesc.text=@"Περιγραφή";
    lblTitleDesc.textColor=ios7BlueColor;
    
    lblAlerttitle.text=sendAlertTitle;
    lblAlertdescr.text=sendAlertDescr;
    lblAlertDate.text=sendAlertDate;
    lblAlertAdr.text=sendAlertaddress;
    
    [lblTitle setAdjustsFontSizeToFitWidth:YES];
    [lblAlertAdr setAdjustsFontSizeToFitWidth:YES];
    [lblAlertDate setAdjustsFontSizeToFitWidth:YES];
    [lblAlerttitle setAdjustsFontSizeToFitWidth:YES];
    [lblAlertdescr setAdjustsFontSizeToFitWidth:YES];
    
    [lblTitle setMinimumScaleFactor:1.0f];
    [lblAlertDate setMinimumScaleFactor:1.0f];
    [lblAlertdescr setMinimumScaleFactor:1.0f];

    lblTitle.font=[UIFont fontWithName:@"HelveticaNeue" size:16.0];
    lblAlerttitle.font=[UIFont fontWithName:@"HelveticaNeue" size:16.0];
    lblAlertdescr.font=[UIFont fontWithName:@"HelveticaNeue" size:16.0];
    lblAlertAdr.font=[UIFont fontWithName:@"HelveticaNeue" size:12.0];
    lblAlertDate.font=[UIFont fontWithName:@"HelveticaNeue" size:14.0];
    
    [lblAlertdescr sizeToFit];
    [lblAlertDate sizeToFit];
    [lblTitle sizeToFit];
    [lblAlertAdr sizeToFit];

    CGSize expectedLabelSize = [lblAlertdescr textRectForBounds:lblAlertdescr.frame
                                limitedToNumberOfLines:lblAlertdescr.numberOfLines].size;
    CGRect newFrame = lblAlertdescr.frame;
    newFrame.size.height = expectedLabelSize.height;
    
    CGSize expectedLabelSize2 = [lblAlertAdr textRectForBounds:lblAlertAdr.frame
                                         limitedToNumberOfLines:lblAlertAdr.numberOfLines].size;
    CGRect newFrame2 = lblAlertAdr.frame;
    newFrame2.size.height = expectedLabelSize2.height;
    
    
    lblAlertdescr.frame =CGRectMake(40,lblTitleDesc.frame.origin.y+lblTitleDesc.frame.size.height+5,newFrame.size.width,newFrame.size.height);
    lineView2.frame=CGRectMake(40, lblAlertdescr.frame.origin.y+lblAlertdescr.frame.size.height+5, self.view.bounds.size.width, 1);
    lblAlertDate.frame=CGRectMake(40, lineView2.frame.origin.y+lineView2.frame.size.height+5,alertDetailScroll.frame.size.width-10 , 16);
    lblAlertAdr.frame=CGRectMake(40, lblAlertDate.frame.origin.y+lblAlertDate.frame.size.height,newFrame2.size.width,newFrame2.size.height);
    
    
    [self.view addSubview:alertImageview];
    [self.view addSubview:imageHint];
    [self.view addSubview:alertDetailScroll];
    [alertDetailScroll addSubview:lblTitle];
    [alertDetailScroll addSubview:lblTitleDesc];
    [alertDetailScroll addSubview:lblAlertdescr];
    [alertDetailScroll addSubview:lblAlerttitle];
    [alertDetailScroll addSubview:lblAlertDate];
    [alertDetailScroll addSubview:lblAlertAdr];
    [self downloadFullAlertImage];
    
}
-(void)downloadFullAlertImage{

    NSURLRequest *url=[NSURLRequest  requestWithURL:[NSURL URLWithString:[NSString stringWithFormat:@"http://localhost/assets/alertimages/%@",sendAlertImage]]];
    
    AFHTTPRequestOperation *postOperation = [[AFHTTPRequestOperation alloc] initWithRequest:url];
    postOperation.responseSerializer = [AFImageResponseSerializer serializer];
    [postOperation setCompletionBlockWithSuccess:^(AFHTTPRequestOperation *operation, id responseObject) {
        FullAlertImage = responseObject;
        alertImageview.userInteractionEnabled=YES;
        [UIView animateWithDuration:1.3
                              delay:0.0
                            options: UIViewAnimationOptionCurveEaseIn
                         animations:^{imageHint.alpha=1.0;}
                         completion:nil];

    } failure:^(AFHTTPRequestOperation *operation, NSError *error) {
        // NSLog(@"Image error: %@", error);
    }];
    [postOperation start];
}
-(void)showAlertimg{
    showAlertImageView *imageV=[[showAlertImageView alloc]init];
    imageV.alertImagePassed=FullAlertImage;
    imageV.modalTransitionStyle=UIModalTransitionStyleCrossDissolve;
    [self presentViewController:imageV animated:YES completion:nil];
}
- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
}

@end
