# -*- coding: utf-8 -*-
"""
File to generate the folium map.
"""
import pandas as pd

import os
import sys

import folium


def get_eco_df():
    """Returns a cleaned dataframe from the startsheet tracker that's maintained on the GAI Teamsite.
    Works on Windows only. For Linux, we'll need to use it via a cached file."""
    eco_file = '\\\\teamplace.gaes.gknaerospace.com\\sites\\gai\\Export Control\\182 Startsheets\\Startsheet_Matrix_GAI.xlsx'
    eco_file = os.path.normpath("Startsheet_Matrix_GAI.xlsx")
    xl = pd.ExcelFile(eco_file)
    sh =  xl.book.sheet_by_index(0)
    nrows = sh.nrows
    ncols= sh.ncols
    
    data = []
    for rown in range(nrows):
        row = []
        for coln in range(ncols):
            cell = sh.cell(rown, coln)
            val = cell.value
            row.append(cell.value)
        valid = False
        for item in row:
            if item!= "":
                valid = True
        if valid:
            data.append(row)
            #print(row)
    header_cols = ['Partner', 'Country', 'Site', 'End Use']
    business = "-"
    new_data = []
    for row in data:
        product = "-"
        partner = "-"
        country = "-"
        site = "-"
        end_use = '-'
        ex_class_us = "-"
        ex_class_eu = "-"
        startsheet_av = "-"
        is_header = True
        for col in header_cols:
            if col not in row:
                is_header=False
                break
        if is_header:
            business = row[0]
        else:
            cleaned_row = [x for x in row if x!=""]
            if len(cleaned_row)>2:
                product = row[0]
                partner = row[1]
                country = row[2]
                
                site = row[3]
                end_use = row[4]
                ex_class_us = row[5]
                ex_class_eu = row[6]
                startsheet_av = row[8] #col7 is some sweden specific data.
                new_row = [business, product, partner, country, site, end_use, ex_class_us, ex_class_eu, startsheet_av]
                new_data.append(new_row)
    headers = ["business","product","partner","country","site","end_use","ex_class_us","ex_class_eu","startsheet_av"]
    df = pd.DataFrame(new_data, columns=headers)
    return df

#load map data.
map_data = pd.read_excel("map list.xlsx")

eco_df = get_eco_df()


