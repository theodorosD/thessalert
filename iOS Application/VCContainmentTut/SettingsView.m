//
//  SettingsView.m
//  VCContainmentTut
//
//  Created by Θεόδωρος Δεληγιαννίδης on 1/22/14.
//  Copyright (c) 2014 AK. All rights reserved.
//

#import "SettingsView.h"
#import "UILabel+UILabel_Boldify.h"

@interface SettingsView ()

@end

@implementation SettingsView
@synthesize alertDetailScroll;

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
    
	// Do any additional setup after loading the view.
    alertDetailScroll = [[UIScrollView alloc] initWithFrame:CGRectMake(0,60, self.view.frame.size.width, self.view.frame.size.height)];
    alertDetailScroll.backgroundColor=[UIColor whiteColor];
    
    UILabel *lblTitle=[[UILabel alloc]initWithFrame:CGRectMake( 10,0,alertDetailScroll.frame.size.width-20, alertDetailScroll.frame.size.height)];
    alertDetailScroll.contentSize=CGSizeMake(self.view.frame.size.width , lblTitle.frame.size.height+50);
    
    lblTitle.text=@"Η εφαρμογή «Θεσσαλονίκη Alert» είναι μια διαδραστική εφαρμογή ενημέρωσης για τον Δήμο Θεσσαλονίκης. Είναι φτιαγμένη στα πλαίσια του διαγωνισμού «Εφαρμογές για τη Θεσσαλονίκη» του δήμου Θεσσαλονίκης.\nH εφαρμογή χρησιμοποιεί δεδομένα που καταχωρούν οι πολίτες της Θεσσαλονίκης σχετικά με διάφορα συμβάντα που συμβαίνουν εκείνη την στιγμή.\nΤα δεδομένα δεν ελέγχονται για την ορθότητα τους ή αν είναι αληθή ή όχι.\nΤο κάθε συμβάν είναι διαθέσιμο για 24 ώρες από την στιγμή της καταχώρησης του.\nΜε την χρήση της εφαρμογής συμφώνείτε με τους όρους χρήσης που είναι αναρτημένοι στην ιστοσελίδα της εφαρμογής.";
    lblTitle.numberOfLines=0;
    lblTitle.lineBreakMode = NSLineBreakByWordWrapping;
    [lblTitle boldSubstring:@"\nΤα δεδομένα δεν ελέγχονται για την ορθότητα τους ή αν είναι αληθή ή όχι."];
    [self.view addSubview:alertDetailScroll];
    [alertDetailScroll addSubview:lblTitle];

}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
