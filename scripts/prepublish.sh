sh scripts/setWebpackMain.sh
# cd client && npm run update-vscode && cd ..
dotnet publish server/AutoUsing -c Release  
webpack --mode production
