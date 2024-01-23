#!/usr/bin/env python
# -*- coding: utf-8 -*- 
# update wikipedia e scuola italiana


# -----------------------------------
# Load libraries

import csv
import pandas as pd
import sys
from datetime import date
from datetime import datetime
from dateutil.parser import parse

reload(sys)
sys.setdefaultencoding('utf-8')


# -----------------------------------
# Custom variables


folder = '/Applications/MAMP/htdocs/lavoro/giovannipro.github.io/wikipedia-scuola-italiana/assets/_data-elab/'

default_str = ''
default_val = '???'


# -----------------------------------
# Main scripts


def update():
	f_prev = folder + 'data/voci_2021.tsv'
	f_curr = folder + 'data/2022_06.tsv'
	f_upda = folder + 'data/voci_2022_06.tsv'

	with open(f_upda,'w+') as f1:

		rows = 100000

		prev = pd.read_csv(f_prev, sep='\t', header=0)
		curr_0 = pd.read_csv(f_curr, sep='\t', header=0) # skiprows=0, nrows=rows 


		header = 'id_wikidata' + '\t' + \
			'article' + '\t' + \
			'subject' + '\t' + \
			'avg_pv' + '\t' + \
			'avg_pv_prev' + '\t' + \
			'size' + '\t' + \
			'size_prev' + '\t' + \
			'notes' + '\t' + \
			'notes_prev' + '\t' + \
			'images' + '\t' + \
			'images_prev' + '\t' + \
			'references' + '\t' + \
			'references_prev' + '\t' + \
			'incipit_size' + '\t' + \
			'incipit_on_size' + '\t' + \
			'incipit_prev' + '\t' + \
			'issues' + '\t' + \
			'issues_prev' + '\t' + \
			'issue_sourceNeeded' + '\t' + \
			'issue_clarify' + '\t' + \
			'discussion_size' + '\t' + \
			'discussion_prev' + '\t' + \
			'first_edit' + '\t' + \
			'days' + '\t' + \
			'all_visits' + '\t' + \
			'VdQ' + '\t' + 'vetrina' + '\t' + \
			'galleria_su_Commons' + '\t' + \
			'pagina_su_commons' + '\t' + \
			'pagina_su_wikisource'

		df = pd.DataFrame()

		# -----
		# filter

		curr_1 = curr_0[curr_0['id_wikidata'] != 'Voce inesistente']
		curr_2 = curr_1[curr_1['first_edit'] != 'ERRORE']
		curr = curr_2[curr_2['avg_pv'] != 'ERRORE']

		# -----
		# join dataset

		merged_1 = pd.merge(curr, prev, on='id_wikidata', how='left')
		# remove duplicates
		# merged.drop_duplicates(subset=['id_wikidata'], inplace=True)
		# merged.dropna(inplace=True)
		# merged_1 = merged #.head(rows)
		# print merged_1

		# -----
		# article main data

		df['id_wikidata'] = merged_1['id_wikidata']
		df['article'] = merged_1['article_x'].astype(str) #.str[:8]
		df['subject'] = merged_1['subject'].astype(str) #.str[:8]

		# -----
		# first edit
		df['first_edit'] = merged_1['first_edit_x'].fillna(default_val)

		differences = []
		specific_date_str = '2022-06-01'
		specific_date = datetime.strptime(specific_date_str, '%Y-%m-%d').date()
		
		for date_str in df['first_edit']:
			try:
				date_obj = parse(date_str)
				days_difference = (specific_date - date_obj.date()).days
				differences.append(days_difference)
			except (ValueError, TypeError, OverflowError):
				differences.append(None)

		df['days'] = differences

		# -----
		# pv

		df['avg_pv'] = merged_1['avg_pv'].fillna(default_val)
		df['avg_pv_prev'] = merged_1['avg_pv_0'].fillna(default_val)
		

		# -----
		# size

		df['size'] = merged_1['size'].fillna(default_val) 
		df['size_prev'] = merged_1['size_0'].fillna(default_val)

		# -----
		# notes
		
		df['notes'] = merged_1['notes'].fillna(default_val)
		df['notes_prev'] = merged_1['notes_0'].fillna(default_val) 

		# # -----
		# # images

		df['images'] = merged_1['images'].fillna(default_val) 
		df['images_prev'] = merged_1['images_0'].fillna(default_val) 

		# -----
		# references

		df['references'] = 0
		df['references_prev'] = merged_1['references_0'].fillna(default_val) 

		# # -----
		# # incipit

		df['incipit_size'] = merged_1['incipit_size'].fillna(default_val) 
		df['incipit_on_size'] = merged_1['incipit_size'].fillna(default_val)  * 100 / merged_1['size'].fillna(default_val) 
		df['incipit_prev'] = merged_1['incipit_size_0'].fillna(default_val)

		# -----
		# issues

		df['issues'] = merged_1['issues'].fillna(default_val) 
		df['issues_prev'] = merged_1['issues_0'].fillna(default_val) 

		df['issue_sourceNeeded'] = merged_1['issue_sourceNeeded_x'].fillna(default_val)
		df['issue_clarify'] = merged_1['issue_clarify_x'].fillna(default_val) 

		# -----
		# discussion_size

		df['discussion_size'] = merged_1['discussion_size'].fillna(default_val) 
		df['discussion_prev'] = merged_1['discussion_size_0'].fillna(default_val)

		# -----
		# other data

		df['all_visits'] = merged_1['all_visits_x'].fillna(default_str).fillna(default_str)
		df['VdQ'] = merged_1['VdQ_x'].fillna(default_str)
		df['galleria_su_Commons'] = merged_1['galleria_su_Commons_x'].fillna(default_str)
		df['pagina_su_commons'] = merged_1['pagina_su_commons_x'].fillna(default_str)
		df['pagina_su_wikisource'] = merged_1['pagina_su_wikisource_x'].fillna(default_str)

		# --------------------------
		# filters

		# df_2 = df_1[df_1['all_visits'] != 'ERRORE']

		# missing = df[df.isna().any(axis=1)]
		# missing_subject_discussion_prev = df[df['discussion_prev'].isnull()].loc[:, ['id_wikidata','article','discussion_prev']]

		# df_1 = df.dropna(axis='columns')


		missing_subject = merged_1[merged_1['subject'].isnull()].loc[:, ['id_wikidata','article','subject','avg_pv']]
		print(missing_subject)


		# print(df_1)


		# --------------------------
		# to do

		# 1. remove the decimals in some numbers
		# 2. sono stati aggiunti nuovi articoli: Metalloide, Lotte in fabbrica
 

		# --------------------------


		df.to_csv(f_upda, sep='\t', index=False)
		# df_test.to_csv(f_upda, sep='\t', index=False)

		print('done')

def add_language_version():

	f_curr = folder + 'data/2022_06.tsv'
	f_lang = folder + 'data/linguistic_versions.tsv'
	f_temp = folder + 'data/temp.tsv'

	with open(f_temp,'w+') as f1:

		curr = pd.read_csv(f_curr, sep='\t', header=0)
		lang = pd.read_csv(f_lang, sep='\t', header=0) # skiprows=0, nrows=rows 

		header = 'linguistic_versions'

		df = pd.DataFrame()

		# join dataset
		merged_1 = pd.merge(curr, lang, on='id_wikidata', how='left')

		merged_1.to_csv(f_temp, sep='\t', index=False)






			
# -----------------------------------
# Start scripts


# update()
add_language_version()



# -----------------------------------
# Load script

'''

python /Applications/MAMP/htdocs/lavoro/giovannipro.github.io/wikipedia-scuola-italiana/assets/_data-elab/_20231001_update_data.py


''' 