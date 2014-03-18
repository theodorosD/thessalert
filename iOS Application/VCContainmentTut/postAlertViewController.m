//
//  postAlertViewController.m
//  VCContainmentTut
//
//  Created by Θεόδωρος Δεληγιαννίδης on 1/17/14.
//  Copyright (c) 2014 AK. All rights reserved.
//

#import "postAlertViewController.h"
#import "PAPPhotoDetailsFooterView.h"
#import <MobileCoreServices/MobileCoreServices.h>
#import "AFNetworking.h"
#import <AddressBookUI/AddressBookUI.h>

@interface postAlertViewController ()
{
    PAPPhotoDetailsFooterView *footerView;
    PAPPhotoDetailsFooterView *footerView2;
    PAPPhotoDetailsFooterView *footerView3;
    BOOL didTookPicture;
    UIButton *btn;
}
@property (nonatomic, strong) UIScrollView *scrollView;
@property (nonatomic, strong) UITextField *titleTextfield;
@property (nonatomic, strong) UITextField *descriptionTextfield;
@property (nonatomic, strong) UITextField *addressTextfield;
@end

#define MAX_LENGTH_TITLE 25
#define MAX_LENGTH_MESSAGE 300

@implementation postAlertViewController
@synthesize cameraImage,scrollView;

- (void)dealloc {
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIKeyboardWillShowNotification object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIKeyboardWillHideNotification object:nil];
}
- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}
- (void)loadView {
    
    didTookPicture=FALSE;
    UIImage *image = [UIImage imageNamed:@"action.png"];
    CGRect imageFrame = CGRectMake(0,0,image.size.width,image.size.height);
    
    btn = [[UIButton alloc] initWithFrame:imageFrame];
    [btn setBackgroundImage:image forState:UIControlStateNormal];
    [btn addTarget:self action:@selector(sendAlert:) forControlEvents:UIControlEventTouchUpInside];
    UIBarButtonItem *bb = [[UIBarButtonItem alloc] initWithCustomView:btn];
    [[self navigationItem] setRightBarButtonItem:bb];
    
    UIImage *imageViewLogo=[UIImage imageNamed:@"86-camera.png"];

	self.scrollView = [[UIScrollView alloc] initWithFrame:[[UIScreen mainScreen] applicationFrame]];
    self.scrollView.delegate = self;
    self.scrollView.backgroundColor = [UIColor colorWithRed:236/255.0 green:240/255.0 blue:241/255.0 alpha:1.0f];
    self.view = self.scrollView;
    self.view.opaque=YES;
    photoImageView = [[UIImageView alloc] initWithFrame:CGRectMake(20.0f, 10.0f, 280.0f, 280.0f)];
    
    [photoImageView setBackgroundColor:[UIColor whiteColor]];
    [photoImageView setImage:cameraImage];
    [photoImageView setImage:imageViewLogo];
    [photoImageView setContentMode:UIViewContentModeCenter];
    
    UITapGestureRecognizer *touchGest=[[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(showCamera)];
    [photoImageView addGestureRecognizer:touchGest];
    photoImageView.userInteractionEnabled=YES;
    
    CALayer *layer = photoImageView.layer;
    layer.masksToBounds = NO;
    layer.shadowRadius = 3.0f;
    layer.shadowOffset = CGSizeMake(0.0f, 2.0f);
    layer.shadowOpacity = 0.5f;
    layer.shouldRasterize = YES;
    [self.scrollView addSubview:photoImageView];
    
    CGRect footerRect = [PAPPhotoDetailsFooterView rectForView];
    footerRect.origin.y = photoImageView.frame.origin.y + photoImageView.frame.size.height;
    
    CGRect footerRect2= [PAPPhotoDetailsFooterView rectForView];
    footerRect2.origin.y = photoImageView.frame.origin.y + photoImageView.frame.size.height+51;
    
    CGRect footerRect3= [PAPPhotoDetailsFooterView rectForView];
    footerRect3.origin.y = photoImageView.frame.origin.y + photoImageView.frame.size.height+102;

    footerView = [[PAPPhotoDetailsFooterView alloc] initWithFrame:footerRect];
    self.titleTextfield = footerView.commentField;
    self.titleTextfield.delegate = self;
    [self.titleTextfield setReturnKeyType:UIReturnKeyDone];
    self.titleTextfield.placeholder=@"Τίτλος(έως 30 χαρακτήρες)";
    layer=footerView.layer;
    layer.masksToBounds = NO;
    layer.shadowRadius = 3.0f;
    layer.shadowOffset = CGSizeMake(0.0f, 2.0f);
    layer.shadowOpacity = 0.5f;
    layer.shouldRasterize = YES;
    [self.scrollView addSubview:footerView];
    
    footerView2 = [[PAPPhotoDetailsFooterView alloc] initWithFrame:footerRect2];
    self.descriptionTextfield = footerView2.commentField;
    self.descriptionTextfield.delegate = self;
    [self.descriptionTextfield setReturnKeyType:UIReturnKeyDone];
    self.descriptionTextfield.placeholder=@"Περιγραφή(έως 300 χαρακτήρες)";
    layer=footerView2.layer;
    layer.masksToBounds = NO;
    layer.shadowRadius = 3.0f;
    layer.shadowOffset = CGSizeMake(0.0f, 2.0f);
    layer.shadowOpacity = 0.5f;
    layer.shouldRasterize = YES;
    [self.scrollView addSubview:footerView2];
    
    footerView3 = [[PAPPhotoDetailsFooterView alloc] initWithFrame:footerRect3];
    self.addressTextfield = footerView3.commentField;
    self.addressTextfield.delegate = self;
    [self.addressTextfield setReturnKeyType:UIReturnKeyDone];
    self.addressTextfield.placeholder=@"Διεύθυνση";
    self.addressTextfield.text=[self.placemark.addressDictionary valueForKey:@"Street"];
    layer=footerView3.layer;
    layer.masksToBounds = NO;
    layer.shadowRadius = 3.0f;
    layer.shadowOffset = CGSizeMake(0.0f, 2.0f);
    layer.shadowOpacity = 0.5f;
    layer.shouldRasterize = YES;
    [self.scrollView addSubview:footerView3];
    
    [self.scrollView setContentSize:CGSizeMake(self.scrollView.bounds.size.width, photoImageView.frame.origin.y + photoImageView.frame.size.height + footerView.frame.size.height+footerView2.frame.size.height+footerView3.frame.size.height)];

}
- (void)viewDidLoad
{
    [super viewDidLoad];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardWillShow:) name:UIKeyboardWillShowNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardWillHide:) name:UIKeyboardWillHideNotification object:nil];
}
- (void)showImagePickerForSourceType:(UIImagePickerControllerSourceType)sourceType
{
    UIImagePickerController *imagePickerController = [[UIImagePickerController alloc] init];
    imagePickerController.modalPresentationStyle = UIModalPresentationCurrentContext;
    imagePickerController.sourceType = sourceType;
    imagePickerController.delegate = self;
    imagePickerController.mediaTypes= [NSArray arrayWithObjects:(NSString *)kUTTypeImage, nil];
    imagePickerController = imagePickerController;
    imagePickerController.allowsEditing=YES;
    [imagePickerController.view setFrame:CGRectMake(0, 20, 320, imagePickerController.view.frame.size.height - 20)];
    [self presentViewController:imagePickerController animated:NO completion:nil];
}
- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary *)info
{
    [self dismissViewControllerAnimated:YES completion:NULL];
     UIImage *image =[info objectForKey:UIImagePickerControllerEditedImage];
    [NSThread detachNewThreadSelector:@selector(useImage:) toTarget:self withObject:image];

   //photoImageView.image=(UIImage *)[info objectForKey:UIImagePickerControllerEditedImage];
   //[photoImageView setContentMode:UIViewContentModeScaleAspectFit];
    //didTookPicture=TRUE;
}
- (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker
{
    didTookPicture=FALSE;
}

-(void)useImage:(UIImage *)image
{
    @autoreleasepool {
        // parse your CSV
    photoImageView.image=image;
    [photoImageView setContentMode:UIViewContentModeScaleAspectFit];
    didTookPicture=TRUE;
    }
}
-(void)showCamera
{
    [self showImagePickerForSourceType:UIImagePickerControllerSourceTypeCamera];
}
#pragma mark - UITextFieldDelegate

- (BOOL)textFieldShouldReturn:(UITextField *)textField {
    [textField resignFirstResponder];
    return YES;
}

#pragma mark - UIScrollViewDelegate

- (void)scrollViewWillBeginDragging:(UIScrollView *)scrollView {
    [self.titleTextfield resignFirstResponder];
    [self.descriptionTextfield resignFirstResponder];
    [self.addressTextfield resignFirstResponder];

}
- (void)keyboardWillShow:(NSNotification *)note {
    CGFloat upAndDown;
           upAndDown=3;
    
    CGRect keyboardFrameEnd = [[note.userInfo objectForKey:UIKeyboardFrameEndUserInfoKey] CGRectValue];
    CGSize scrollViewContentSize = scrollView.bounds.size;
    scrollViewContentSize.height += keyboardFrameEnd.size.height;
    [self.scrollView setContentSize:scrollViewContentSize];
    
    CGPoint scrollViewContentOffset = self.scrollView.contentOffset;
    // Align the bottom edge of the photo with the keyboard
    scrollViewContentOffset.y = scrollViewContentOffset.y + keyboardFrameEnd.size.height*(float)upAndDown - [UIScreen mainScreen].bounds.size.height+30;
    
    [self.scrollView setContentOffset:scrollViewContentOffset animated:YES];
}

- (void)keyboardWillHide:(NSNotification *)note {
    CGRect keyboardFrameEnd = [[note.userInfo objectForKey:UIKeyboardFrameEndUserInfoKey] CGRectValue];
    CGSize scrollViewContentSize = self.scrollView.bounds.size;
    scrollViewContentSize.height -= keyboardFrameEnd.size.height;
    [UIView animateWithDuration:0.200f animations:^{
        [self.scrollView setContentSize:CGSizeMake(self.scrollView.bounds.size.width, photoImageView.frame.origin.y + photoImageView.frame.size.height + footerView.frame.size.height+footerView2.frame.size.height+footerView3.frame.size.height)];//scrollViewContentSize];
        CGRect frame = CGRectMake(0, 0, self.scrollView.bounds.size.width, self.scrollView.bounds.size.height);
        [self.scrollView scrollRectToVisible:frame animated:YES];

    }];
}
- (void)sendAlert:(id)sender
{
    if([self.titleTextfield.text length]>5 && [self.descriptionTextfield.text length]>10){
    if(didTookPicture==TRUE)//Change
    {
    [UIApplication sharedApplication].networkActivityIndicatorVisible = YES;
    btn.enabled=FALSE;
    //IMAGE STUFF
    NSData *imageToUpload;
    
    NSString *fullFilename;
    NSDate *date = [NSDate date];
    NSTimeInterval ti = [date timeIntervalSince1970];
    fullFilename=[NSString stringWithFormat:@"%f",ti];
    
    imageToUpload = UIImageJPEGRepresentation(photoImageView.image,0.5f);
    //OTHER STUFF
    NSString *alertCatergoryParameter=[NSString stringWithFormat:@"%d",self.alertPassType];
    NSString *alertTitleParameter=[NSString stringWithFormat:@"%@",self.titleTextfield.text];
    NSString *alertDescriptionParameter=[NSString stringWithFormat:@"%@",self.descriptionTextfield.text];
    NSString *alertLatitude=[NSString stringWithFormat:@"%f",self.userLocationCoords.latitude];
    NSString *alertLongitude=[NSString stringWithFormat:@"%f",self.userLocationCoords.longitude];
    NSString *alertImageFilename=[NSString stringWithFormat:@"%@.jpg",fullFilename];
    NSString *alertGeoAdr=self.addressTextfield.text;
    
    AFHTTPRequestOperationManager *manager = [[AFHTTPRequestOperationManager alloc] initWithBaseURL:[NSURL URLWithString:@"http://localhost/"]];
    manager.responseSerializer=[AFHTTPResponseSerializer serializer];
    //manager.responseSerializer.acceptableContentTypes = [NSSet setWithObject:@"text/html"];
    NSDictionary *parameters = @{@"myname":@"iOS App", @"email":@"ios@test.com",@"address":alertGeoAdr,@"alert_cat":alertCatergoryParameter,@"title":alertTitleParameter,@"description":alertDescriptionParameter,@"latitude":alertLatitude,@"longitude":alertLongitude,@"imagefilename":alertImageFilename};
    
    AFHTTPRequestOperation *op = [manager POST:@"iosupload.php" parameters:parameters constructingBodyWithBlock:^(id<AFMultipartFormData> formData) {
        //do not put image inside parameters dictionary as I did, but append it! imageToUpload
        [formData appendPartWithFileData:imageToUpload name:@"imgse" fileName:fullFilename mimeType:@"image/jpeg"];
    } success:^(AFHTTPRequestOperation *operation, id responseObject) {
        NSString *string = [[NSString alloc] initWithData:responseObject encoding:NSUTF8StringEncoding];
        [UIApplication sharedApplication].networkActivityIndicatorVisible = NO;
         btn.enabled=TRUE;
        [self.navigationController popViewControllerAnimated:YES];
        NSLog(@"Success: %@  ", string);
    } failure:^(AFHTTPRequestOperation *operation, NSError *error) {
        NSLog(@"Error: %@ ***** %@", operation.responseString, error);
         btn.enabled=TRUE;
    }];
    [op start];
    }else{
        UIAlertView *message = [[UIAlertView alloc] initWithTitle:@"Φωτογραφία συμβάντος"
                                                          message:@"Η φωτογραφία είναι απαραίτητη για την καταχώρηση συμβάντος."
                                                         delegate:nil
                                                cancelButtonTitle:@"Εντάξει"
                                                otherButtonTitles:nil];
        [message show];

    }
    }else{
        UIAlertView *message = [[UIAlertView alloc] initWithTitle:@"Πληροφορίες συμβάντος"
                                                          message:@"Παρακαλούμε, δώστε ένα περιεκτικό τίτλο και περιγραφή συμβάντος."
                                                         delegate:nil
                                                cancelButtonTitle:@"Εντάξει"
                                                otherButtonTitles:nil];
        [message show];
    }

}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
    
    
}

@end
