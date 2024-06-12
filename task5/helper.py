import csv


def csv_processing(filename):
    fields = []
    rows = []

    with open(filename, 'r') as csvfile:
        csvreader = csv.DictReader(csvfile)

        for row in csvreader:
            print(row["Customer Id"])

        # preposessing eg. handeling missing vals
        for row in csvreader:
            for column in row:
                # print(column)
                if column == None or column == "":
                    print("HERE IS NULL COLUMN")
                    # replace it with something then....
                    
        return "done"
