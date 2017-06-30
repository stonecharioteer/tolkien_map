#!/opt/anaconda3/bin python

"""
Flask Application to serve the Tolkien map.
===
Created by Vinay Keerthi (yy54426)

"""


import os
import sys

from flask import Flask, url_for, render_template, jsonify, Response, json
import pandas as pd

app = Flask(__name__)

@app.route("/")
@app.route("/map")
def serve_index():
    return render_template("map.html")



@app.route("/map_list_data")
def serve_map_list_data():
    """Used to fetch the JSON data"""
    data_file = os.path.join("data","map list.xlsx")
    map_data_df = pd.read_excel(data_file)
    condition_one = pd.notnull(map_data_df["Latitude"])
    condition_two = pd.notnull(map_data_df["Longitude"])
    condition = [one and two for one,two in zip(condition_one, condition_two)]
    filtered_df = map_data_df.loc[condition]
    filtered_df.sort_values(by=["Latitude","Longitude"],inplace=True)
    return jsonify(filtered_df.to_json(orient='records'))


@app.route("/export_control_data")
def serve_export_control_data():
    # Find a way to get this data from Sharepoint through Linux instead of a local file.
    # Or should this be a Windows Flask server?
    eco_file = os.path.join("data","Startsheet_Matrix_GAI.xlsx")
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
    eco_df = pd.DataFrame(new_data, columns=headers)
    return jsonify(eco_df.to_json(orient="records"))

def main():
    """Function to run the application."""
    app.run(debug=True, port=8081, host="0.0.0.0")


if __name__ == "__main__":
    main()