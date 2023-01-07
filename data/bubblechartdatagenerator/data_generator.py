import pandas as pd

df=pd.read_excel('Cleaned-TinderStories.xlsx')

grouped_cat=df.groupby('Category')['Title'].count()
grouped_cat=grouped_cat.to_frame()
grouped_cat=grouped_cat.reset_index()
grouped_cat=grouped_cat.rename(columns={'Title':'Count'})
grouped_cat.to_csv('Reddit_posts.csv')