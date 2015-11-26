# Update script
echo '###################################'
echo '##### r7PopUpStore Update Script ##'

# Checkout all the files
echo 'Dismissing local changes...'
git checkout -- *

# Checkout master branch
echo 'Checking out master branch...'
git checkout master

# Pull the newest version
echo 'Pulling latest version...'
git pull

# # Checkout all the files
# echo 'Checking out pinned version...'
# git checkout v1.1.0

# Done !
echo '##### r7PopUpStore is up to date. #'
echo '###################################'